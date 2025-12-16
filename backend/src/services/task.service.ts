import TaskRepository from "../repositories/task.repository";
import { CreateTaskInput, UpdateTaskInput } from "../dtos/task.dto";
import SocketService from "./socket.service";

export default class TaskService {
  static async create(data: CreateTaskInput & { creatorId: string }) {
    const task = await TaskRepository.create(data);

    // Broadcast to all (or specific room logic)
    SocketService.io.emit("task:created", task);

    // If assigned to someone else, notify them
    if (data.assignedToId && data.assignedToId !== data.creatorId) {
      SocketService.io.to(data.assignedToId).emit("task:assigned", task);
    }

    return task;
  }

  static async getAll(filters: {
    creatorId?: string;
    assignedToId?: string;
    status?: string;
    priority?: string;
    sortBy?: "asc" | "desc";
  }) {
    return TaskRepository.findAll(filters);
  }

  static async getById(id: string) {
    const task = await TaskRepository.findById(id);
    if (!task) throw new Error("Task not found");
    return task;
  }

  static async update(id: string, data: UpdateTaskInput) {
    const task = await TaskRepository.update(id, data);

    SocketService.io.emit("task:updated", task);

    // If assigned user changed, notify the new assignee
    if (data.assignedToId) {
      SocketService.io.to(data.assignedToId).emit("task:assigned", task);
    }

    return task;
  }

  static async delete(id: string) {
    await TaskRepository.delete(id);
    SocketService.io.emit("task:deleted", id);
    return { message: "Task deleted successfully" };
  }
}
