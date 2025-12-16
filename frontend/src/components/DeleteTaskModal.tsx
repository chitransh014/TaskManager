import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTaskApi } from "../api/tasks.api";
import { socket } from "../sockets/socket";

interface DeleteTaskModalProps {
  open: boolean;
  onClose: () => void;
  taskId: string | null;
}

export default function DeleteTaskModal({ open, onClose, taskId }: DeleteTaskModalProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteTaskApi(taskId!),
    onSuccess: () => {
      socket.emit("task:deleted");
      queryClient.invalidateQueries(["dashboard"]);
      onClose();
    },
  });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Delete Task?</h2>

        <p className="text-gray-600 text-center mb-6">
          This action cannot be undone. Are you sure you want to delete this task?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl hover:bg-gray-200 transition font-medium"
          >
            Cancel
          </button>

          <button
            onClick={() => mutation.mutate()}
            className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-bold hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
