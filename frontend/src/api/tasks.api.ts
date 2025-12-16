// src/api/tasks.api.ts
import { api } from "./axios";

// -----------------------------
// Task Types
// -----------------------------
export interface TaskPayload {
  title: string;
  description: string;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
  assignedToId?: string | null;
}

export interface UpdateTaskPayload extends Partial<TaskPayload> { }


// -----------------------------
// CREATE TASK
// -----------------------------
export const createTaskApi = async (data: TaskPayload) => {
  const res = await api.post("/tasks", data);
  return res.data.task;
};


// -----------------------------
// GET ALL TASKS (with filtering)
// -----------------------------
export const listTasksApi = async (params?: {
  status?: string;
  priority?: string;
  sortByDueDate?: "asc" | "desc";
}) => {
  const res = await api.get("/tasks", { params });
  return res.data.tasks;
};


// -----------------------------
// GET TASK BY ID
// -----------------------------
export const getTaskApi = async (id: string) => {
  const res = await api.get(`/tasks/${id}`);
  return res.data.task;
};


// -----------------------------
// UPDATE TASK
// -----------------------------
export const updateTaskApi = async (id: string, data: UpdateTaskPayload) => {
  const res = await api.put(`/tasks/${id}`, data);
  return res.data.task;
};


// -----------------------------
// DELETE TASK
// -----------------------------
export const deleteTaskApi = async (id: string) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};


// -----------------------------
// TASKS CREATED BY CURRENT USER
// -----------------------------
export const createdByMeApi = async (params?: any) => {
  const res = await api.get("/tasks/created-by-me", { params });
  return res.data.tasks;
};


// -----------------------------
// TASKS ASSIGNED TO ME
// -----------------------------
export const assignedToMeApi = async (params?: any) => {
  const res = await api.get("/tasks/assigned-to-me", { params });
  return res.data.tasks;
};


// -----------------------------
// OVERDUE TASKS
// -----------------------------
export const overdueTasksApi = async (params?: any) => {
  const res = await api.get("/tasks/overdue", { params });
  return res.data.tasks;
};


// -----------------------------
// UPDATE ONLY STATUS
// -----------------------------
export const updateStatusApi = async (id: string, status: TaskPayload["status"]) => {
  const res = await api.put(`/tasks/${id}`, { status });
  return res.data.task;
};


// -----------------------------
// UPDATE ASSIGNEE
// -----------------------------
export const updateAssigneeApi = async (id: string, assignedToId: string | null) => {
  const res = await api.put(`/tasks/${id}`, { assignedToId });
  return res.data.task;
};
