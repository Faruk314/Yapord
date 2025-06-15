"use client";

import { useChatCallStore } from "@/features/chats/store /ChatCalls";
import { useMediasoupStore } from "../../store/mediasoup";
import { useCallEmiters } from "../../websocket/emiters/call";
import { useMediasoupEmiters } from "../../websocket/emiters/mediasoup";
import useProducer from "./useProducer";

export default function useCallManager() {
  const producers = useMediasoupStore((state) => state.producers);
  const removeProducer = useMediasoupStore((state) => state.removeProducer);
  const { createVideoProducer, createDisplayProducer } = useProducer();

  const consumers = useMediasoupStore((state) => state.consumers);
  const removeConsumer = useMediasoupStore((state) => state.removeConsumer);

  const setSendTransport = useMediasoupStore((state) => state.setSendTransport);
  const setRecvTransport = useMediasoupStore((state) => state.setRecvTransport);
  const clientSendTransport = useMediasoupStore((state) => state.sendTransport);

  const localStreams = useMediasoupStore((state) => state.localStreams);
  const getLocalStream = useMediasoupStore((state) => state.getLocalStream);
  const removeLocalStream = useMediasoupStore(
    (state) => state.removeLocalStream
  );

  const setDevice = useMediasoupStore((state) => state.setDevice);
  const getProducer = useMediasoupStore((state) => state.getProducer);

  const closeChatCallModal = useChatCallStore((state) => state.closeCallModal);

  const { emitCloseProducer } = useMediasoupEmiters();
  const { emitCallLeave } = useCallEmiters();

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
      removeConsumer(consumer.id);
    });

    setSendTransport(null);
    setRecvTransport(null);
    setDevice(null);

    closeChatCallModal();
  }

  async function toogleCamera() {
    const producer = getProducer("webcam");

    if (producer) {
      emitCloseProducer({ producerId: producer.id }, () => {
        producer?.close();

        const cameraStream = getLocalStream("webcam");

        cameraStream?.getVideoTracks().forEach((track) => track.stop());

        removeLocalStream("webcam");

        removeProducer("webcam");
      });
    } else {
      if (!clientSendTransport)
        throw new Error("Client send transport does not exist");

      await createVideoProducer(clientSendTransport);
    }
  }

  async function toogleScreenShare() {
    const producer = getProducer("screen");

    if (producer) {
      emitCloseProducer({ producerId: producer.id }, () => {
        producer.close();

        const screenStream = getLocalStream("screen");

        screenStream?.getVideoTracks().forEach((track) => track.stop());

        removeLocalStream("screen");

        removeProducer("screen");
      });
    } else {
      if (!clientSendTransport)
        throw new Error("Client send transport does not exist");

      await createDisplayProducer(clientSendTransport);
    }
  }

  return { leaveCall, toogleCamera, toogleScreenShare };
}
