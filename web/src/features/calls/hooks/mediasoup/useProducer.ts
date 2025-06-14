import { Transport } from "mediasoup-client/types";
import { getUserMediaStream } from "../../utils/mediasoup";
import { useMediasoupStore } from "../../store/mediasoup";

export default function useProducer() {
  const addLocalStream = useMediasoupStore((state) => state.addLocalStream);
  const addProducer = useMediasoupStore((state) => state.addProducer);

  async function createVideoProducer(clientSendTransport: Transport) {
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

  function createAudioProducer() {}

  return { createVideoProducer, createAudioProducer };
}
