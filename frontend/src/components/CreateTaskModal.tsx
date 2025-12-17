import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTaskApi } from "../api/tasks.api";
import { useNotification } from "../context/NotificationContext";

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"]).optional(),
  assignedToId: z.string().optional(),
});

type CreateTaskForm = z.infer<typeof createTaskSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  users?: { id: string; name: string }[];
}

export default function CreateTaskModal({ open, onClose, users = [] }: Props) {
  const { show } = useNotification();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskForm>({
    resolver: zodResolver(createTaskSchema),
  });

  const mutation = useMutation({
    mutationFn: createTaskApi,
    onSuccess: () => {
      show("Task created successfully");
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); // Invalidate dashboard query
      reset();
      onClose();
    },
    onError: (err: any) => {
      show(err.response?.data?.message || "Failed to create task");
    },
  });

  const onSubmit = (data: CreateTaskForm) => {
    mutation.mutate({ ...data, status: data.status || "TODO" } as any);
  };

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
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Task</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("title")}
              placeholder="Task Title"
              className="w-full p-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          <div>
            <textarea
              {...register("description")}
              placeholder="Description"
              rows={3}
              className="w-full p-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-600">Due Date</label>
              <input
                type="datetime-local"
                {...register("dueDate")}
                className="w-full p-2 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate.message}</p>}
            </div>

            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-600">Priority</label>
              <select
                {...register("priority")}
                className="w-full p-2.5 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">Assign To (Optional)</label>
            <select
              {...register("assignedToId")}
              className="w-full p-2.5 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all"
          >
            {mutation.isPending ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
}
