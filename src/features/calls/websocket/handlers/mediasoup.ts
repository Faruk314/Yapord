"use client";

import { Device, types } from "mediasoup-client";
import { useMediasoupEmiters } from "../emiters/mediasoup";
import { Itransport } from "../../types/mediasoup";
import { useMediasoupStore } from "../../store/mediasoup";

export function useMediasoupHandlers() {
  const { emitCreateTransport } = useMediasoupEmiters();
  const device = useMediasoupStore((state) => state.device);
  const setDevice = useMediasoupStore((state) => state.setDevice);
  const setRecvTransport = useMediasoupStore((state) => state.setRecvTransport);
  const setSendTransport = useMediasoupStore((state) => state.setSendTransport);

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
  }) {
    const { sendTransportData, recvTransportData } = data;

    const clientSendTransport = device?.createSendTransport(sendTransportData);

    if (!clientSendTransport)
      throw new Error("Could not create client send transport");

    setSendTransport(clientSendTransport);

    const clientRecvTransport = device?.createRecvTransport(recvTransportData);

    if (!clientRecvTransport)
      throw new Error("Could not create client recv transport");

    setRecvTransport(clientRecvTransport);
  }

  return { onRtpCapabilities, onTransportCreated };
}
