import { ConnectTransportCallback } from "../../types/mediasoup";
import { getOrCreateRouter } from "../../mediasoup/mediasoup";
import { getPeer, peers } from "mediasoup/methods/peer";
import { types } from "mediasoup";

import { Server, Socket } from "socket.io";
import { setupConsumerListeners } from "mediasoup/methods/consumer";
import { setupProducerListeners } from "mediasoup/methods/producer";
import { createWebRtcTransport } from "mediasoup/methods/transport";

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
    const sendTransportData = await createWebRtcTransport(
      channelId,
      this.socket.id,
      "send"
    );

    const recvTransportData = await createWebRtcTransport(
      channelId,
      this.socket.id,
      "recv"
    );

    this.socket.emit("transportCreated", {
      channelId,
      sendTransportData,
      recvTransportData,
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
    const peer = getPeer(this.socket.id);

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
    const peer = getPeer(this.socket.id);

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
    const peer = getPeer(this.socket.id);

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

    setupProducerListeners(this.socket, peer, producer);

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

    const peer = getPeer(this.socket.id);

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

    setupConsumerListeners(this.socket, peer, consumer);

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
