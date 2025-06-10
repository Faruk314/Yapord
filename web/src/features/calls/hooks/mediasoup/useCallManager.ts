"use client";

import { useMediasoupStore } from "../../store/mediasoup";
import { useCallEmiters } from "../../websocket/emiters/call";

export default function useCallManager() {
  const consumers = useMediasoupStore((state) => state.consumers);
  const removeConsumer = useMediasoupStore((state) => state.removeConsumer);
  const setSendTransport = useMediasoupStore((state) => state.setSendTransport);
  const setRecvTransport = useMediasoupStore((state) => state.setRecvTransport);
  const localStream = useMediasoupStore((state) => state.localStream);
  const setLocalStream = useMediasoupStore((state) => state.setLocalStream);
  const setDevice = useMediasoupStore((state) => state.setDevice);

  const { emitCallLeave } = useCallEmiters();

  function closeConsumer(consumerId: string) {
    const consumerToRemove = consumers.get(consumerId);

    consumerToRemove?.close();

    removeConsumer(consumerId);
  }

  function leaveCall() {
    emitCallLeave();

    localStream?.getTracks().forEach((track) => track.stop());
    setLocalStream(null);

    consumers.forEach((consumer) => closeConsumer(consumer.id));

    setSendTransport(null);
    setRecvTransport(null);
    setDevice(null);
  }

  return { leaveCall };
}
