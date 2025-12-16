import { Router } from "express";
import TaskController from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Apply authMiddleware to all routes
router.use(authMiddleware);

// Specific routes first to avoid collision with :id
router.get("/assigned-to-me", TaskController.getAssignedToMe);
router.get("/created-by-me", TaskController.getCreatedByMe);
router.get("/overdue", TaskController.getOverdue);

const controller = new TaskController();

router.post("/", TaskController.create);
router.get("/", TaskController.getAll);
router.get("/:id", TaskController.getById);
router.put("/:id", TaskController.update);
router.delete("/:id", TaskController.delete);

export default router;
