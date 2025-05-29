import { getOrCreateRouter, userTransportMap } from "@/mediasoup/mediasoup";

import { Server, Socket } from "socket.io";

class MediasoupListeners {
  io: Server;
  socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  registerListeners() {
    this.socket.on("getRtpCapabilities", this.onGetRtpCapabilities.bind(this));

    this.socket.on("createTransport", this.onCreateTransport.bind(this));
  }

  async onGetRtpCapabilities({ channelId }: { channelId: string }) {
    const router = await getOrCreateRouter(channelId);

    this.socket.emit("rtpCapabilities", {
      channelId,
      routerRtpCapabilities: router.rtpCapabilities,
    });
  }

  async onCreateTransport({ channelId }: { channelId: string }) {
    const router = await getOrCreateRouter(channelId);

    const sendTransport = await router.createWebRtcTransport({
      listenIps: [{ ip: "127.0.0.1", announcedIp: undefined }],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
    });

    const recvTransport = await router.createWebRtcTransport({
      listenIps: [{ ip: "127.0.0.1", announcedIp: undefined }],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
    });

    userTransportMap.set(this.socket.id, {
      send: sendTransport,
      recv: recvTransport,
    });

    this.socket.emit("transportCreated", {
      sendTransportData: {
        id: sendTransport.id,
        iceParameters: sendTransport.iceParameters,
        iceCandidates: sendTransport.iceCandidates,
        dtlsParameters: sendTransport.dtlsParameters,
      },
      recvTransportData: {
        id: recvTransport.id,
        iceParameters: recvTransport.iceParameters,
        iceCandidates: recvTransport.iceCandidates,
        dtlsParameters: recvTransport.dtlsParameters,
      },
    });
  }
}

export default MediasoupListeners;
