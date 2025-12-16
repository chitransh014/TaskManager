import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTaskApi, updateTaskApi } from "../api/tasks.api";
import DeleteTaskModal from "../components/DeleteTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import GradientBackground from "../components/GradientBackground";
import { socket } from "../sockets/socket";
import { api } from "../api/axios";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Fetch Task Details
  const { data: task, refetch } = useQuery({
    queryKey: ["task", id],
    queryFn: () => getTaskApi(id!),
  });

  // Fetch users for assignment dropdown
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/auth/all-users");
      return res.data.users;
    },
  });

  // UPDATE STATUS
  const statusMutation = useMutation({
    mutationFn: (status: any) => updateTaskApi(id!, { status }),
    onSuccess: () => {
      socket.emit("task:updated");
      queryClient.invalidateQueries(["task", id]);
      queryClient.invalidateQueries(["dashboard"]);
    },
  });

  // Real-time updates
  useEffect(() => {
    socket.on("task:updated", refetch);
    socket.on("task:deleted", () => navigate("/"));

    return () => {
      socket.off("task:updated");
      socket.off("task:deleted");
    };
  }, []);

  if (!task) {
    return (
      <GradientBackground>
        <div className="text-white text-xl">Loading...</div>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <div className="bg-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-xl text-white max-w-2xl w-full mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{task.title}</h1>

          <div className="flex gap-2">
            <button
              onClick={() => setEditOpen(true)}
              className="px-3 py-1 bg-white/20 rounded hover:bg-white/30"
            >
              Edit
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              className="px-3 py-1 bg-red-500 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Priority Badge */}
        <div className="mt-3">
          <span
            className={`px-4 py-1 rounded-full text-sm ${
              task.priority === "URGENT"
                ? "bg-red-500"
                : task.priority === "HIGH"
                ? "bg-orange-400"
                : task.priority === "MEDIUM"
                ? "bg-yellow-400"
                : "bg-blue-400"
            }`}
          >
            {task.priority}
          </span>
        </div>

        {/* Description */}
        <p className="mt-6 opacity-90 whitespace-pre-line">{task.description}</p>

        {/* Status */}
        <div className="mt-6">
          <label className="mr-2">Status:</label>
          <select
            className="glass px-3 py-2 rounded-lg"
            defaultValue={task.status}
            onChange={(e) => statusMutation.mutate(e.target.value)}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Assignee */}
        <div className="mt-6">
          <label className="mr-2">Assigned To:</label>
          <select
            className="glass px-3 py-2 rounded-lg"
            defaultValue={task.assignedToId || ""}
            onChange={(e) =>
              updateTaskApi(id!, { assignedToId: e.target.value || null }).then(() => {
                socket.emit("task:updated");
                refetch();
              })
            }
          >
            <option value="">Unassigned</option>
            {users?.map((u: any) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dates */}
        <div className="mt-8 flex flex-col gap-2 opacity-80">
          <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
          <p>Updated: {new Date(task.updatedAt).toLocaleString()}</p>
          <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Modals */}
      <EditTaskModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        task={task}
      />

      <DeleteTaskModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        taskId={task.id}
      />
    </GradientBackground>
  );
}
