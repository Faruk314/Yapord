"use client";

import { useChatCallStore } from "@/features/chats/store /ChatCalls";
import { useMediasoupStore } from "../../store/mediasoup";
import { useCallEmiters } from "../../websocket/emiters/call";

export default function useCallManager() {
  const consumers = useMediasoupStore((state) => state.consumers);
  const producers = useMediasoupStore((state) => state.producers);
  const removeProducer = useMediasoupStore((state) => state.removeProducer);
  const removeConsumer = useMediasoupStore((state) => state.removeConsumer);
  const setSendTransport = useMediasoupStore((state) => state.setSendTransport);
  const setRecvTransport = useMediasoupStore((state) => state.setRecvTransport);
  const localStreams = useMediasoupStore((state) => state.localStreams);
  const removeLocalStream = useMediasoupStore(
    (state) => state.removeLocalStream
  );
  const setDevice = useMediasoupStore((state) => state.setDevice);
  const closeChatCallModal = useChatCallStore((state) => state.closeCallModal);
  const getProducer = useMediasoupStore((state) => state.getProducer);

  const { emitCallLeave } = useCallEmiters();

  function closeConsumer(consumerId: string) {
    const consumerToRemove = consumers.get(consumerId);

    consumerToRemove?.close();

    removeConsumer(consumerId);
  }

  function leaveCall() {
    emitCallLeave();

    localStreams.forEach((stream, type) => {
      stream.getTracks().forEach((track) => track.stop());
      removeLocalStream(type);
    });

    producers.forEach((producer, type) => {
      producer.close();
      removeProducer(type);
    });

    consumers.forEach((consumer) => {
      consumer.close();
      closeConsumer(consumer.id);
    });

    setSendTransport(null);
    setRecvTransport(null);
    setDevice(null);

    closeChatCallModal();
  }

  function toogleCamera() {
    const producer = getProducer("webcam");

    producer?.pause();
  }

  return { leaveCall, toogleCamera };
}
