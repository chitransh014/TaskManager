import { Server } from "socket.io";

class SocketService {
    private static _io: Server;

    static init(io: Server) {
        this._io = io;
    }

    static get io() {
        if (!this._io) {
            throw new Error("Socket.io not initialized!");
        }
        return this._io;
    }
}

export default SocketService;
