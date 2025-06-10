import { ConnectTransportCallback } from "../../types/mediasoup";
import { getOrCreateRouter, peers } from "../../mediasoup/mediasoup";
import { types } from "mediasoup";

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

    this.socket.on(
      "connectSendTransport",
      this.onConnectSendTransport.bind(this)
    );

    this.socket.on(
      "connectRecvTransport",
      this.onConnectRecvTransport.bind(this)
    );

    this.socket.on("createProducer", this.onCreateProducer.bind(this));

    this.socket.on("createConsumer", this.onCreateConsumer.bind(this));
  }

  async onGetRtpCapabilities({ channelId }: { channelId: string }) {
    const router = await getOrCreateRouter(channelId);

    const peer = {
      id: this.socket.user.id,
      channelId,
      producers: new Map(),
      consumers: new Map(),
    };

    peers.set(this.socket.id, peer);

    this.socket.emit("rtpCapabilities", {
      channelId,
      routerRtpCapabilities: router.rtpCapabilities,
    });
  }

  async onCreateTransport({ channelId }: { channelId: string }) {
    const router = await getOrCreateRouter(channelId);
    const peer = peers.get(this.socket.id);

    if (!peer) {
      throw new Error("Peer state not found");
    }

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

    peer.sendTransport = sendTransport;
    peer.recvTransport = recvTransport;

    this.socket.emit("transportCreated", {
      channelId,
      sendTransportData: {
        id: sendTransport.id,
        iceParameters: sendTransport.iceParameters,
        iceCandidates: sendTransport.iceCandidates,
        dtlsParameters: sendTransport.dtlsParameters,
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      },
      recvTransportData: {
        id: recvTransport.id,
        iceParameters: recvTransport.iceParameters,
        iceCandidates: recvTransport.iceCandidates,
        dtlsParameters: recvTransport.dtlsParameters,
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      },
    });
  }

  async onConnectSendTransport(
    {
      transportId,
      dtlsParameters,
    }: {
      transportId: string;
      dtlsParameters: types.DtlsParameters;
    },
    callback: ConnectTransportCallback
  ) {
    const peer = peers.get(this.socket.id);

    const sendTransport = peer?.sendTransport;

    if (!sendTransport || sendTransport.id !== transportId) {
      return callback({ error: "Send Transport not found or ID mismatch" });
    }

    try {
      await sendTransport.connect({ dtlsParameters });

      return callback();
    } catch (error) {
      return callback({
        error:
          (error as Error).message || "Unknown error connecting send transport",
      });
    }
  }

  async onConnectRecvTransport(
    {
      transportId,
      dtlsParameters,
    }: {
      transportId: string;
      dtlsParameters: types.DtlsParameters;
    },
    callback: ConnectTransportCallback
  ) {
    const peer = peers.get(this.socket.id);

    const recvTransport = peer?.recvTransport;

    if (!recvTransport || recvTransport.id !== transportId) {
      return callback({ error: "Recv Transport not found or ID mismatch" });
    }

    try {
      await recvTransport.connect({ dtlsParameters });

      return callback();
    } catch (error) {
      return callback({
        error:
          (error as Error).message || "Unknown error connecting recv transport",
      });
    }
  }

  async onCreateProducer(
    {
      channelId,
      transportId,
      kind,
      rtpParameters,
      appData,
    }: {
      channelId: string;
      transportId: string;
      kind: types.MediaKind;
      rtpParameters: types.RtpParameters;
      appData?: types.AppData;
    },
    callback: (response?: { id?: string; error?: string } | null) => void
  ) {
    const peer = peers.get(this.socket.id);

    const sendTransport = peer?.sendTransport;

    if (!sendTransport || sendTransport.id !== transportId) {
      return callback({ error: "Send Transport not found or ID mismatch" });
    }

    const producerAppData: types.AppData = {
      ...(appData || {}),
      user: { ...this.socket.user, socketId: this.socket.id },
    };

    const producer = await sendTransport.produce({
      kind,
      rtpParameters,
      appData: producerAppData,
    });

    peer.producers.set(producer.id, producer);

    producer.on("transportclose", () => {
      peer.producers.delete(producer.id);

      this.socket
        .to(channelId)
        .emit("producerClosed", { producerId: producer.id });
    });

    producer.on("@close", () => {
      peer.producers.delete(producer.id);

      this.socket
        .to(channelId)
        .emit("producerClosed", { producerId: producer.id });
    });

    this.socket.to(channelId).emit("newProducer", {
      producerId: producer.id,
      channelId,
      socketId: this.socket.id,
      kind: producer.kind,
      appData: producer.appData,
    });
  }

  async onCreateConsumer(
    {
      channelId,
      recvTransportId,
      producerId,
      rtpCapabilities,
    }: {
      channelId: string;
      recvTransportId: string;
      producerId: string;
      rtpCapabilities: types.RtpCapabilities;
    },
    callback: (response: { id?: string; error?: string } | null) => void
  ) {
    const router = await getOrCreateRouter(channelId);

    if (!router) {
      return callback({ error: "Mediasoup Router not found." });
    }

    const peer = peers.get(this.socket.id);

    const recvTransport = peer?.recvTransport;

    if (!recvTransport || recvTransport.id !== recvTransportId) {
      return callback({
        error: `Client's receive transport ${recvTransportId} not found or transport id mismatch.`,
      });
    }

    let producerToConsume: types.Producer | undefined;

    for (const p of peers.values()) {
      if (p.producers.has(producerId)) {
        producerToConsume = p.producers.get(producerId);

        break;
      }
    }

    if (!producerToConsume) {
      return callback({ error: `Producer with ID ${producerId} not found.` });
    }

    if (
      !router.canConsume({ producerId: producerToConsume.id, rtpCapabilities })
    ) {
      return callback({
        error:
          "Router cannot consume this producer with provided RTP capabilities.",
      });
    }

    const consumer = await recvTransport.consume({
      producerId: producerToConsume.id,
      rtpCapabilities,
      paused: producerToConsume.paused,
      appData: producerToConsume.appData,
    });

    peer.consumers.set(consumer.id, consumer);

    consumer.on("transportclose", () => {
      peer.consumers.delete(consumer.id);
    });

    consumer.on("producerclose", () => {
      consumer.close();

      peer.consumers.delete(consumer.id);

      this.socket.emit("consumerClosed", {
        consumerId: consumer.id,
        producerId: consumer.producerId,
      });
    });

    consumer.on("producerpause", () => {
      consumer.pause();

      this.socket.emit("consumerResumed", { consumerId: consumer.id });
    });

    consumer.on("producerresume", () => {
      consumer.resume();
    });

    console.log("finished creating consumer");

    const response = {
      id: consumer.id,
      producerId: consumer.producerId,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
      type: consumer.type,
      producerPaused: consumer.producerPaused,
      appData: consumer.appData,
    };

    callback(response);
  }
}

export default MediasoupListeners;
