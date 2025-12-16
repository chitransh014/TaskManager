import { Request, Response } from "express";
import TaskService from "../services/task.service";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto";

export default class TaskController {
  static async create(req: Request, res: Response) {
    try {
      const parsed = CreateTaskDto.parse(req.body);
      const creatorId = req.user?.id;

      if (!creatorId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const task = await TaskService.create({ ...parsed, creatorId });
      return res.status(201).json(task);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const filters: any = {};
      if (req.query.creatorId) filters.creatorId = req.query.creatorId as string;
      if (req.query.assignedToId) filters.assignedToId = req.query.assignedToId as string;

      const tasks = await TaskService.getAll(filters);
      return res.json(tasks);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const task = await TaskService.getById(req.params.id);
      return res.json(task);
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const parsed = UpdateTaskDto.parse(req.body);
      const task = await TaskService.update(req.params.id, parsed);
      return res.json(task);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await TaskService.delete(req.params.id);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }

  static async getAssignedToMe(req: Request, res: Response) {
    try {
      const filters = {
        assignedToId: req.user!.id,
        status: req.query.status as string,
        priority: req.query.priority as string,
        sortBy: req.query.sortBy as "asc" | "desc",
      };
      // Remove undefined keys
      Object.keys(filters).forEach((key) => (filters as any)[key] === undefined && delete (filters as any)[key]);

      const tasks = await TaskService.getAll(filters);
      return res.json({ tasks });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  static async getCreatedByMe(req: Request, res: Response) {
    try {
      const filters = {
        creatorId: req.user!.id,
        status: req.query.status as string,
        priority: req.query.priority as string,
        sortBy: req.query.sortBy as "asc" | "desc",
      };
      Object.keys(filters).forEach((key) => (filters as any)[key] === undefined && delete (filters as any)[key]);

      const tasks = await TaskService.getAll(filters);
      return res.json({ tasks });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  static async getOverdue(req: Request, res: Response) {
    try {
      const tasks = await TaskService.getAll({ assignedToId: req.user!.id });
      const now = new Date();
      const overdue = tasks.filter((t: any) => new Date(t.dueDate) < now && t.status !== "COMPLETED");
      return res.json({ tasks: overdue });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
}
