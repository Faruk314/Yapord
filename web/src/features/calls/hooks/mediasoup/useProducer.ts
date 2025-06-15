import { Transport } from "mediasoup-client/types";
import {
  getUserAudioStream,
  getUserDisplayStream,
  getUserMediaStream,
} from "../../utils/mediasoup";
import { useMediasoupStore } from "../../store/mediasoup";

export default function useProducer() {
  const addLocalStream = useMediasoupStore((state) => state.addLocalStream);
  const addProducer = useMediasoupStore((state) => state.addProducer);

  async function createVideoProducer(clientSendTransport: Transport) {
    const { stream, videoTrack } = await getUserMediaStream();

    addLocalStream("webcam", stream);

    const newProducer = await clientSendTransport.produce({
      track: videoTrack,
      appData: { streamType: "video" },
      encodings: [
        { rid: "r0", maxBitrate: 100_000, scaleResolutionDownBy: 4 },
        { rid: "r1", maxBitrate: 300_000, scaleResolutionDownBy: 2 },
        { rid: "r2", maxBitrate: 900_000, scaleResolutionDownBy: 1 },
      ],
    });

    addProducer("webcam", newProducer);
  }

  async function createAudioProducer(clientSendTransport: Transport) {
    const { stream, audioTrack } = await getUserAudioStream();

    addLocalStream("mic", stream);

    const newProducer = await clientSendTransport.produce({
      track: audioTrack,
      appData: { streamType: "audio" },
    });

    addProducer("mic", newProducer);
  }

  async function createDisplayProducer(clientSendTransport: Transport) {
    const { stream, screenTrack } = await getUserDisplayStream();

    addLocalStream("screen", stream);

    const newProducer = await clientSendTransport.produce({
      track: screenTrack,
      appData: { streamType: "screenShare" },
    });

    addProducer("screen", newProducer);
  }

  return { createVideoProducer, createAudioProducer, createDisplayProducer };
}
