import { z } from "zod";

export const CreateTaskDto = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.coerce.date(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"]).default("TODO"),
  assignedToId: z.string().optional().nullable(),
});

export const UpdateTaskDto = CreateTaskDto.partial();

export type CreateTaskInput = z.infer<typeof CreateTaskDto>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskDto>;
