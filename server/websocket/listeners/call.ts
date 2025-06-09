import { getUser } from "@yapord/shared/redis/methods/user";
import {
  addChannelMember,
  removeChannelMember,
} from "@yapord/shared/redis/methods/channel";

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
    channelId,
    recipientId,
  }: {
    channelId: string;
    recipientId: string;
  }) {
    const recipient = await getUser(recipientId);

    if (!recipient) return console.error("Recipient not found");

    this.socket.join(channelId);

    await addChannelMember(channelId, this.socket.user.id);

    this.socket
      .to(recipient?.socketId)
      .emit("incomingCall", { channelId, senderInfo: this.socket.user });
  }

  async onCallDecline({
    channelId,
    callerId,
  }: {
    channelId: string;
    callerId: string;
  }) {
    const removedMember = await removeChannelMember(channelId, callerId);

    if (!removedMember) return;

    console.log(removedMember, "removed member");

    this.socket.leave(channelId);

    this.socket.to(removedMember.socketId).emit("callDeclined");
  }

  async onCallAccept({ channelId }: { channelId: string }) {
    this.socket.join(channelId);

    await addChannelMember(channelId, this.socket.user.id);

    this.io.to(channelId).emit("callAccepted", { channelId });
  }
}

export default CallListeners;
