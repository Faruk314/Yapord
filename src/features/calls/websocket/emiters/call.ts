import { Socket } from "socket.io-client";

function emitUserCall(
  socket: Socket,
  data: { channelId: string; recipientId: string }
) {
  socket.emit("callUser", data);
}

function emitCallDecline(socket: Socket, data: { callerId: string }) {
  socket.emit("callDecline", data);
}

function emitCallAccept(socket: Socket) {
  socket.emit("callAccept");
}

export { emitUserCall, emitCallDecline, emitCallAccept };
