import { Server, Socket } from "socket.io";

class ChannelListeners {
  io: Server;
  socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  registerListeners() {
    this.socket.on("reconnectToRoom", this.onReconnectToRoom.bind(this));
  }

  onReconnectToRoom(roomId: string) {
    this.socket.join(roomId);
  }
}

export default ChannelListeners;
