import prisma from "../utils/prisma";
import { CreateTaskInput, UpdateTaskInput } from "../dtos/task.dto";

export default class TaskRepository {
  static async create(data: CreateTaskInput & { creatorId: string }) {
    return prisma.task.create({
      data,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  }

  static async findAll(filters: {
    creatorId?: string;
    assignedToId?: string;
    status?: string;
    priority?: string;
    sortBy?: "asc" | "desc";
  }) {
    const { sortBy, status, priority, ...otherFilters } = filters;

    const where: any = { ...otherFilters };
    if (status) where.status = status as "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
    if (priority) where.priority = priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT";

    return prisma.task.findMany({
      where,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { dueDate: sortBy || "asc" },
    });
  }

  static async findById(id: string) {
    return prisma.task.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  }

  static async update(id: string, data: UpdateTaskInput) {
    return prisma.task.update({
      where: { id },
      data,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  }

  static async delete(id: string) {
    return prisma.task.delete({
      where: { id },
    });
  }
}
