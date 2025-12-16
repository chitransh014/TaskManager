import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateTaskApi } from "../api/tasks.api";
import { api } from "../api/axios";
import { socket } from "../sockets/socket";

interface EditTaskModalProps {
  open: boolean;
  onClose: () => void;
  task: any;
}

export default function EditTaskModal({ open, onClose, task }: EditTaskModalProps) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "LOW",
    status: "TODO",
    assignedToId: "",
  });

  // Load the task data into form when modal opens
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate.split("T")[0],
        priority: task.priority,
        status: task.status,
        assignedToId: task.assignedToId || "",
      });
    }
  }, [task]);

  // Fetch users for assignment
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/auth/all-users");
      return res.data.users;
    },
  });

  // UPDATE MUTATION
  const mutation = useMutation({
    mutationFn: () => updateTaskApi(task.id, form),
    onSuccess: () => {
      socket.emit("task:updated");
      queryClient.invalidateQueries(["dashboard"]);
      onClose();
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (!task) return null;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Task</h2>

        <form onSubmit={submit} className="space-y-4">

          {/* Title */}
          <div>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Task Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <textarea
              className="w-full p-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            {/* Due Date */}
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-600">Due Date</label>
              <input
                type="date"
                className="w-full p-2.5 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-purple-500"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>

            {/* Priority */}
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-600">Priority</label>
              <select
                className="w-full p-2.5 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-purple-500"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            {/* Status */}
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-600">Status</label>
              <select
                className="w-full p-2.5 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-purple-500"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">Review</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            {/* Assignee */}
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-600">Assign To</label>
              <select
                className="w-full p-2.5 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-purple-500"
                value={form.assignedToId}
                onChange={(e) => setForm({ ...form, assignedToId: e.target.value })}
              >
                <option value="">Unassigned</option>
                {users?.map((u: any) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
