"use client";

import { Device, types } from "mediasoup-client";
import { useMediasoupEmiters } from "../emiters/mediasoup";
import { Itransport, ProducerAppData } from "../../types/mediasoup";
import { useMediasoupStore } from "../../store/mediasoup";
import { getCurrentUser } from "@/features/auth/actions/user";
import { Consumer } from "mediasoup-client/types";

export function useMediasoupHandlers() {
  const {
    emitCreateTransport,
    emitConnectSendTransport,
    emitConnectRecvTransport,
    emitCreateProducer,
    emitCreateConsumer,
  } = useMediasoupEmiters();
  const device = useMediasoupStore((state) => state.device);
  const setDevice = useMediasoupStore((state) => state.setDevice);
  const setRecvTransport = useMediasoupStore((state) => state.setRecvTransport);
  const setSendTransport = useMediasoupStore((state) => state.setSendTransport);
  const clientRecvTransport = useMediasoupStore((state) => state.recvTransport);
  const addConsumer = useMediasoupStore((state) => state.addConsumer);
  const removeConsumer = useMediasoupStore((state) => state.removeConsumer);
  const setLocalStream = useMediasoupStore((state) => state.setLocalStream);

  async function onRtpCapabilities({
    channelId,
    routerRtpCapabilities,
  }: {
    channelId: string;
    routerRtpCapabilities: types.RtpCapabilities;
  }) {
    const device = new Device();

    await device.load({ routerRtpCapabilities });

    setDevice(device);

    emitCreateTransport({ channelId });
  }

  async function onTransportCreated(data: {
    sendTransportData: Itransport;
    recvTransportData: Itransport;
    channelId: string;
  }) {
    const { sendTransportData, recvTransportData, channelId } = data;

    const clientSendTransport = device?.createSendTransport(sendTransportData);

    if (!clientSendTransport)
      throw new Error("Could not create client send transport");

    setSendTransport(clientSendTransport);

    clientSendTransport.on(
      "connect",
      async ({ dtlsParameters }, callback, errback) => {
        console.log('FRONTEND: clientSendTransport "connect" event has FIRED!');
        emitConnectSendTransport(
          {
            transportId: clientSendTransport.id,
            dtlsParameters: dtlsParameters,
          },
          callback,
          errback
        );
      }
    );

    const clientRecvTransport = device?.createRecvTransport(recvTransportData);

    if (!clientRecvTransport)
      throw new Error("Could not create client recv transport");

    setRecvTransport(clientRecvTransport);

    clientRecvTransport.on(
      "connect",
      async ({ dtlsParameters }, callback, errback) => {
        console.log('FRONTEND: clientRecvTransport "connect" event has FIRED!');
        emitConnectRecvTransport(
          {
            transportId: clientRecvTransport.id,
            dtlsParameters: dtlsParameters,
          },
          callback,
          errback
        );
      }
    );

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    setLocalStream(stream);

    const audioTrack = stream.getAudioTracks()[0];

    if (!audioTrack) throw new Error("Could not find audio track");

    clientSendTransport.on(
      "produce",
      ({ kind, rtpParameters, appData }, callback, errback) => {
        console.log(
          `Frontend: clientSendTransport 'produce' event for kind: ${kind}`
        );

        emitCreateProducer(
          {
            channelId,
            transportId: clientSendTransport!.id,
            kind,
            rtpParameters,
            appData,
          },

          (producerInfo) => {
            console.log(
              `Frontend: Producer created with ID: ${producerInfo.id}`
            );
            callback(producerInfo);
          },
          (error) => {
            console.error("Frontend: Error in producer creation:", error);
            errback(error);
          }
        );
      }
    );

    const videoTrack = stream.getVideoTracks()[0];

    await clientSendTransport.produce({
      track: videoTrack,

      encodings: [
        { rid: "r0", maxBitrate: 100000, scaleResolutionDownBy: 4 },
        { rid: "r1", maxBitrate: 300000, scaleResolutionDownBy: 2 },
        { rid: "r2", maxBitrate: 900000, scaleResolutionDownBy: 1 },
      ],
    });
  }

  async function onNewProducer(data: {
    producerId: string;
    socketId: string;
    kind: types.MediaKind;
    appData?: ProducerAppData;
    channelId: string;
  }) {
    console.log(`Frontend: Received newProducer event:`, data);

    const currentUser = await getCurrentUser();

    if (data.appData?.user.id === currentUser?.id) {
      console.log("Frontend: Skipping consumption of my own producer.");
      return;
    }

    if (!clientRecvTransport || !device) {
      console.error(
        "Frontend: clientRecvTransport or device not ready to consume."
      );

      throw new Error("Client recv transport or device not ready to consume");
    }

    const consumerData = {
      recvTransportId: clientRecvTransport.id,
      channelId: data.channelId,
      producerId: data.producerId,
      rtpCapabilities: device.rtpCapabilities,
    };

    emitCreateConsumer(consumerData, async (consumerInfo) => {
      const consumer: Consumer = await clientRecvTransport.consume({
        id: consumerInfo.id,
        producerId: consumerInfo.producerId,
        kind: consumerInfo.kind,
        rtpParameters: consumerInfo.rtpParameters,
        appData: consumerInfo.appData,
      });

      console.log(consumer, "consumer");

      if (!clientRecvTransport || !device) {
        return console.warn(
          `Frontend: clientRecvTransport or device not ready to consume yet. Deferring consumer creation for producerId: ${consumerInfo.producerId}`
        );
      }

      addConsumer(consumer.id, consumer);

      consumer.on("transportclose", () => {
        console.log(`Frontend: Consumer ${consumer.id} transport closed.`);

        removeConsumer(consumer.id);
      });

      consumer.on("@close", () => {
        console.log(`Frontend: Consumer ${consumer.id} producer closed.`);

        removeConsumer(consumer.id);
      });

      consumer.on("trackended", () => {
        console.log(`Frontend: Consumer ${consumer.id} track ended.`);

        removeConsumer(consumer.id);
      });

      consumer.on("@resume", () => consumer.resume());

      consumer.on("@pause", () => consumer.pause());
    });
  }

  return { onRtpCapabilities, onTransportCreated, onNewProducer };
}
