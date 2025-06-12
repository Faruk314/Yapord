import { useMediasoupStore } from "../../store/mediasoup";
import { Itransport } from "../../types/mediasoup";
import { getUserMediaStream } from "../../utils/mediasoup";
import { useMediasoupEmiters } from "../../websocket/emiters/mediasoup";

export default function useMediasoupTransport() {
  const device = useMediasoupStore((store) => store.device);

  const {
    emitConnectSendTransport,
    emitConnectRecvTransport,
    emitCreateProducer,
  } = useMediasoupEmiters();

  const setSendTransport = useMediasoupStore((store) => store.setSendTransport);
  const setRecvTransport = useMediasoupStore((store) => store.setRecvTransport);
  const addLocalStream = useMediasoupStore((store) => store.addLocalStream);
  const addProducer = useMediasoupStore((store) => store.addProducer);

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

    const { stream, videoTrack } = await getUserMediaStream();

    addLocalStream("webcam", stream);

    const newProducer = await clientSendTransport.produce({
      track: videoTrack,
      encodings: [
        { rid: "r0", maxBitrate: 100_000, scaleResolutionDownBy: 4 },
        { rid: "r1", maxBitrate: 300_000, scaleResolutionDownBy: 2 },
        { rid: "r2", maxBitrate: 900_000, scaleResolutionDownBy: 1 },
      ],
    });

    addProducer("webcam", newProducer);
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
