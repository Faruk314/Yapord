"use client";

import { Device, types } from "mediasoup-client";
import { useMediasoupEmiters } from "../emiters/mediasoup";
import { Iconsumer, Itransport, ProducerAppData } from "../../types/mediasoup";
import { useMediasoupStore } from "../../store/mediasoup";
import { getCurrentUser } from "@/features/auth/actions/user";
import { useCallback } from "react";
import useMediasoupTransport from "../../hooks/mediasoup/useTransport";
import useMediasoupConsumer from "../../hooks/mediasoup/useConsumer";

export function useMediasoupHandlers() {
  const { emitCreateTransport } = useMediasoupEmiters();
  const { setupSendTransport, setupRecvTransport } = useMediasoupTransport();
  const { setupConsumer } = useMediasoupConsumer();
  const device = useMediasoupStore((state) => state.device);
  const setDevice = useMediasoupStore((state) => state.setDevice);
  const clientRecvTransport = useMediasoupStore((state) => state.recvTransport);
  const removeConsumer = useMediasoupStore((state) => state.removeConsumer);
  const consumers = useMediasoupStore((state) => state.consumers);

  const onRtpCapabilities = useCallback(
    async ({
      channelId,
      routerRtpCapabilities,
    }: {
      channelId: string;
      routerRtpCapabilities: types.RtpCapabilities;
    }) => {
      try {
        const device = new Device();
        await device.load({ routerRtpCapabilities });
        setDevice(device);
        emitCreateTransport({ channelId });
      } catch {
        throw new Error("Failed to handle RTP capabilities:");
      }
    },
    [emitCreateTransport, setDevice]
  );

  const onTransportCreated = useCallback(
    async (data: {
      sendTransportData: Itransport;
      recvTransportData: Itransport;
      channelId: string;
    }) => {
      const { sendTransportData, recvTransportData, channelId } = data;

      await Promise.all([
        setupSendTransport(sendTransportData, channelId),
        setupRecvTransport(recvTransportData),
      ]);
    },
    [setupSendTransport, setupRecvTransport]
  );

  const onNewProducer = useCallback(
    async (data: {
      producerId: string;
      socketId: string;
      kind: types.MediaKind;
      appData?: ProducerAppData;
      channelId: string;
    }) => {
      const currentUser = await getCurrentUser();

      if (data.appData?.user.id === currentUser?.id) {
        console.log("Frontend: Skipping consumption of my own producer.");
        return;
      }

      if (!clientRecvTransport || !device) {
        throw new Error("Client recv transport or device not ready to consume");
      }

      const consumerData = {
        recvTransportId: clientRecvTransport.id,
        channelId: data.channelId,
        producerId: data.producerId,
        rtpCapabilities: device.rtpCapabilities,
      };

      await setupConsumer(consumerData);
    },
    [clientRecvTransport, setupConsumer, device]
  );

  const onProducerClosed = useCallback(
    (data: { producerId: string }) => {
      const { producerId } = data;

      const consumersToClose: Iconsumer[] = [];

      consumers.forEach((consumer) => {
        if (consumer.producerId === producerId) {
          consumersToClose?.push(consumer);
        }
      });

      consumersToClose.forEach((consumer) => {
        consumer.close();
        removeConsumer(consumer.id);
      });
    },
    [consumers, removeConsumer]
  );

  const onConsumerClosed = useCallback(
    (data: { consumerId: string }) => {
      const { consumerId } = data;

      const consumer = consumers.get(consumerId);

      if (consumer) {
        consumer?.close();

        removeConsumer(consumer.id);
      }
    },
    [consumers, removeConsumer]
  );

  return {
    onRtpCapabilities,
    onTransportCreated,
    onNewProducer,
    onProducerClosed,
    onConsumerClosed,
  };
}
