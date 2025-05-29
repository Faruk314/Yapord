import { getUser } from "@/features/auth/db/redis/user";
import { Server, Socket } from "socket.io";

class CallListeners {
  io: Server;
  socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  registerListeners() {
    this.socket.on("callUser", this.onCallUser.bind(this));
    this.socket.on("callDecline", this.onCallDecline.bind(this));
    this.socket.on("callAccept", this.onCallAccept.bind(this));
  }

  async onCallUser({
    recipientId,
    channelId,
  }: {
    recipientId: string;
    channelId: string;
  }) {
    const recipient = await getUser(recipientId);

    if (!recipient) return console.error("Recipient not found");

    this.socket.join(channelId);

    this.socket
      .to(recipient?.socketId)
      .emit("incomingCall", { channelId, senderInfo: this.socket.user });
  }

  async onCallDecline({ callerId }: { callerId: string }) {
    const caller = await getUser(callerId);

    if (!caller) return console.error("Caller not found");

    this.socket.to(caller?.socketId).emit("callDeclined");
  }

  async onCallAccept({ channelId }: { channelId: string }) {
    this.socket.join(channelId);

    this.io.to(channelId).emit("callAccepted", { channelId });
  }
}

export default CallListeners;
