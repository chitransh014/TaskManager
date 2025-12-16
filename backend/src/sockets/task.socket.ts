import { Server, Socket } from "socket.io";

export default function taskSocket(socket: Socket, io: Server) {
  console.log("🔥 User connected:", socket.id);

  // On connection, client must send their userId to join a personal room
  socket.on("register", (userId: string) => {
    socket.join(userId);
    console.log("User joined personal room:", userId);
  });

  /**
   * Real-time task updates (broadcast to all except sender)
   */
  socket.on("task:update", (task) => {
    socket.broadcast.emit("task:updated", task);
    console.log("🔄 Task updated broadcasted");
  });

  /**
   * Real-time new task creation
   */
  socket.on("task:create", (task) => {
    socket.broadcast.emit("task:created", task);
    console.log("🆕 Task created broadcasted");
  });

  /**
   * Real-time delete
   */
  socket.on("task:delete", (taskId) => {
    socket.broadcast.emit("task:deleted", taskId);
    console.log("❌ Task delete broadcasted");
  });

  /**
   * Notify only assigned user
   */
  socket.on("task:assigned", ({ task, assignedToId }) => {
    io.to(assignedToId).emit("task:assigned", task);
    console.log("📩 Assignment notification sent to:", assignedToId);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
}
