import { ConnectTransportCallback } from "../../types/mediasoup";
import {
  getOrCreateRouter,
  userConsumerMap,
  userProducerMap,
  userTransportMap,
} from "../../mediasoup/mediasoup";
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
    const sendTransport = userTransportMap.get(this.socket.id)?.send;

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
    const recvTransport = userTransportMap.get(this.socket.id)?.recv;

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
    const sendTransport = userTransportMap.get(this.socket.id)?.send;

    if (!sendTransport || sendTransport.id !== transportId) {
      return callback({ error: "Send Transport not found or ID mismatch" });
    }

    const producerAppData: types.AppData = {
      ...(appData || {}),
      user: this.socket.user,
    };

    const producer = await sendTransport.produce({
      kind,
      rtpParameters,
      appData: producerAppData,
    });

    userProducerMap.set(producer.id, producer);

    producer.on("transportclose", () => {
      userProducerMap.delete(producer.id);
    });

    producer.on("@close", () => {
      userProducerMap.delete(producer.id);
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

    const consumerTransport = userTransportMap.get(this.socket.id)?.recv;

    if (!consumerTransport || consumerTransport.id !== recvTransportId) {
      return callback({
        error: `Client's receive transport ${recvTransportId} not found or transport id mismatch.`,
      });
    }

    const producerToConsume = userProducerMap.get(producerId);

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

    const consumer = await consumerTransport.consume({
      producerId: producerToConsume.id,
      rtpCapabilities,
      paused: producerToConsume.paused,
      appData: producerToConsume.appData,
    });

    userConsumerMap.set(consumer.id, [
      ...(userConsumerMap.get(consumer.id) || []),
      consumer,
    ]);

    consumer.on("transportclose", () => {
      userConsumerMap.delete(consumer.id);
    });

    consumer.on("producerclose", () => {
      consumer.close();
      userConsumerMap.delete(consumer.id);
    });

    consumer.on("producerpause", () => {
      consumer.pause();
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
