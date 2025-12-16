import http from "http";
import { Server } from "socket.io";
import app from "./app";
import taskSocket from "./sockets/task.socket";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

import SocketService from "./services/socket.service";

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

SocketService.init(io);


io.on("connection", (socket) => {
  taskSocket(socket, io);
});

server.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
