import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskApi, deleteTaskApi } from "../api/tasks.api";
import { socket } from "../sockets/socket";
import { useState } from "react";
import DeleteTaskModal from "./DeleteTaskModal";

interface TaskCardProps {
  task: any;
  onEdit?: (task: any) => void;
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);



  // ----------------------------
  //  UPDATE STATUS
  // ----------------------------
  const statusMutation = useMutation({
    mutationFn: (status: any) =>
      updateTaskApi(task.id, { status }),
    onSuccess: () => {
      socket.emit("task:updated");
      queryClient.invalidateQueries(["dashboard"]);
    },
  });

  // ----------------------------
  //  DELETE TASK
  // ----------------------------
  const deleteMutation = useMutation({
    mutationFn: () => deleteTaskApi(task.id),
    onSuccess: () => {
      socket.emit("task:deleted");
      queryClient.invalidateQueries(["dashboard"]);
    },
  });

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsUpdating(true);
    statusMutation.mutate(e.target.value);
    setTimeout(() => setIsUpdating(false), 600);
  };

  return (
    <div
      className={`glass p-5 rounded-xl text-white shadow-md transition-all relative ${isUpdating ? "ring-2 ring-green-300" : "hover:scale-[1.02]"
        }`}
    >
      {/* Title and Priority */}
      <div className="flex justify-between mb-2">
        <h2 className="font-bold text-xl">{task.title}</h2>

        <span
          className={`px-3 py-1 rounded-full text-sm ${task.priority === "URGENT"
              ? "bg-red-500/80"
              : task.priority === "HIGH"
                ? "bg-orange-400/80"
                : task.priority === "MEDIUM"
                  ? "bg-yellow-400/80"
                  : "bg-blue-400/80"
            }`}
        >
          {task.priority}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm opacity-80 line-clamp-2">{task.description}</p>

      {/* Status + Due Date */}
      <div className="flex justify-between mt-4 text-sm opacity-80">
        <div>
          <label className="mr-2">Status:</label>
          <select
            className="bg-white/20 rounded px-2 py-1 text-white cursor-pointer hover:bg-white/30 transition shadow-sm border border-white/20"
            defaultValue={task.status}
            onChange={handleStatusChange}
          >
            <option className="text-black" value="TODO">To Do</option>
            <option className="text-black" value="IN_PROGRESS">In Progress</option>
            <option className="text-black" value="REVIEW">Review</option>
            <option className="text-black" value="COMPLETED">Completed</option>
          </select>
        </div>

        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => onEdit && onEdit(task)}
          className="bg-white/20 text-white px-3 py-1 rounded hover:bg-white/30"
        >
          Edit
        </button>

        <button
          onClick={() => setDeleteOpen(true)}
          className="bg-red-500/70 text-white px-3 py-1 rounded hover:bg-red-500"
        >
          Delete
        </button>

      </div>

      <DeleteTaskModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        taskId={task.id}
      />
    </div>
  );
}
