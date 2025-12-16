import TaskService from "../src/services/task.service";
import TaskRepository from "../src/repositories/task.repository";
import SocketService from "../src/services/socket.service";

// Mock dependencies
jest.mock("../src/repositories/task.repository");
jest.mock("../src/services/socket.service", () => ({
    io: {
        emit: jest.fn(),
        to: jest.fn().mockReturnThis(),
    },
}));

describe("TaskService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should create a task and emit socket event", async () => {
            const mockTask = { id: "1", title: "Test Task", creatorId: "user1" };
            (TaskRepository.create as jest.Mock).mockResolvedValue(mockTask);

            const input = {
                title: "Test Task",
                description: "Desc",
                dueDate: new Date(),
                priority: "LOW" as const,
                status: "TODO" as const,
                creatorId: "user1",
            };

            const result = await TaskService.create(input);

            expect(TaskRepository.create).toHaveBeenCalledWith(input);
            expect(SocketService.io.emit).toHaveBeenCalledWith("task:created", mockTask);
            expect(result).toEqual(mockTask);
        });

        it("should notify assignee if assigned to someone else", async () => {
            const mockTask = { id: "1", title: "Test Task", creatorId: "user1", assignedToId: "user2" };
            (TaskRepository.create as jest.Mock).mockResolvedValue(mockTask);

            const input = {
                title: "Test Task",
                description: "Desc",
                dueDate: new Date(),
                priority: "LOW" as const,
                status: "TODO" as const,
                creatorId: "user1",
                assignedToId: "user2",
            };

            await TaskService.create(input);

            expect(SocketService.io.to).toHaveBeenCalledWith("user2");
            expect(SocketService.io.to("user2").emit).toHaveBeenCalledWith("task:assigned", mockTask);
        });
    });

    describe("update", () => {
        it("should update task and emit update event", async () => {
            const mockTask = { id: "1", title: "Updated Task" };
            (TaskRepository.update as jest.Mock).mockResolvedValue(mockTask);

            const updateData = { title: "Updated Task" };
            const result = await TaskService.update("1", updateData);

            expect(TaskRepository.update).toHaveBeenCalledWith("1", updateData);
            expect(SocketService.io.emit).toHaveBeenCalledWith("task:updated", mockTask);
            expect(result).toEqual(mockTask);
        });
    });

    describe("delete", () => {
        it("should delete task and emit delete event", async () => {
            (TaskRepository.delete as jest.Mock).mockResolvedValue({ id: "1" });

            await TaskService.delete("1");

            expect(TaskRepository.delete).toHaveBeenCalledWith("1");
            expect(SocketService.io.emit).toHaveBeenCalledWith("task:deleted", "1");
        });
    });
});
