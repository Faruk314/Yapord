import { useCallStore } from "../../store/call";
import { useMediasoupStore } from "../../store/mediasoup";
import { Itransport } from "../../types/mediasoup";
import { useMediasoupEmiters } from "../../websocket/emiters/mediasoup";
import useProducer from "./useProducer";

export default function useMediasoupTransport() {
  const device = useMediasoupStore((store) => store.device);

  const {
    emitConnectSendTransport,
    emitConnectRecvTransport,
    emitCreateProducer,
  } = useMediasoupEmiters();

  const setSendTransport = useMediasoupStore((store) => store.setSendTransport);
  const setRecvTransport = useMediasoupStore((store) => store.setRecvTransport);

  const { createAudioProducer, createVideoProducer } = useProducer();

  const callInfo = useCallStore((store) => store.incomingCallInfo);

  async function setupSendTransport(
    sendTransportData: Itransport,
    channelId: string
  ) {
    if (!device) throw new Error("Device not initialized");

    const clientSendTransport = device?.createSendTransport(sendTransportData);

    if (!clientSendTransport)
      throw new Error("Could not create client send transport");

    setSendTransport(clientSendTransport);

    clientSendTransport.on(
      "connect",
      async ({ dtlsParameters }, callback, errback) => {
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

    clientSendTransport.on(
      "produce",
      ({ kind, rtpParameters, appData }, callback, errback) => {
        emitCreateProducer(
          {
            channelId,
            transportId: clientSendTransport!.id,
            kind,
            rtpParameters,
            appData,
          },

          (producerInfo) => {
            callback(producerInfo);
          },
          (error) => {
            console.error("Frontend: Error in producer creation:", error);
            errback(error);
          }
        );
      }
    );

    if (callInfo?.callType === "audio") {
      return await createAudioProducer(clientSendTransport);
    }

    if (callInfo?.callType === "video") {
      return await createVideoProducer(clientSendTransport);
    }
  }

  function setupRecvTransport(recvTransportData: Itransport) {
    const clientRecvTransport = device?.createRecvTransport(recvTransportData);

    if (!clientRecvTransport)
      throw new Error("Could not create client recv transport");

    setRecvTransport(clientRecvTransport);

    clientRecvTransport.on(
      "connect",
      async ({ dtlsParameters }, callback, errback) => {
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
  }

  return { setupSendTransport, setupRecvTransport };
}
