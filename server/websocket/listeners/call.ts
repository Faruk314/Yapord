import { getUser } from "@yapord/shared/redis/methods/user";
import {
  addChannelMember,
  removeChannelMember,
} from "@yapord/shared/redis/methods/channel";

import { Server, Socket } from "socket.io";
import {
  cleanupPeerResources,
  createPeer,
  deletePeer,
  getPeer,
  peers,
} from "mediasoup/methods/peer";

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
    this.socket.on("callLeave", this.onCallLeave.bind(this));
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

    await addChannelMember(channelId, this.socket.user.id);

    this.socket.join(channelId);

    createPeer(this.socket.id, this.socket.user.id, channelId);

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

    deletePeer(removedMember.socketId);

    this.socket.leave(channelId);

    this.socket.to(removedMember.socketId).emit("callDeclined");
  }

  async onCallAccept({ channelId }: { channelId: string }) {
    await addChannelMember(channelId, this.socket.user.id);

    this.socket.join(channelId);

    createPeer(this.socket.id, this.socket.user.id, channelId);

    this.io.to(channelId).emit("callAccepted", { channelId });
  }

  async onCallLeave() {
    const peer = getPeer(this.socket.id);

    if (!peer)
      return console.error("Could not initate leave call peer does not exist");

    await removeChannelMember(peer.channelId, peer.userId);

    cleanupPeerResources(peer.id);

    this.socket.leave(peer.channelId);

    this.io.to(peer.channelId).emit("callEnded");
  }
}

export default CallListeners;
