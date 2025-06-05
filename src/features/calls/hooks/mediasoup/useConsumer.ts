import { types } from "mediasoup-client";
import { useMediasoupStore } from "../../store/mediasoup";
import { useMediasoupEmiters } from "../../websocket/emiters/mediasoup";
import { Iconsumer } from "../../types/mediasoup";
import { Iuser } from "@/features/auth/types/user";

export default function useMediasoupConsumer() {
  const { emitCreateConsumer } = useMediasoupEmiters();
  const addConsumer = useMediasoupStore((state) => state.addConsumer);
  const removeConsumer = useMediasoupStore((state) => state.removeConsumer);
  const clientRecvTransport = useMediasoupStore((state) => state.recvTransport);
  const device = useMediasoupStore((state) => state.device);

  async function setupConsumer(consumerData: {
    recvTransportId: string;
    channelId: string;
    producerId: string;
    rtpCapabilities: types.RtpCapabilities;
  }) {
    if (!clientRecvTransport)
      throw new Error("Missing recv transport in consumer setup");

    emitCreateConsumer(consumerData, async (consumerInfo) => {
      const consumer: Iconsumer = await clientRecvTransport.consume({
        id: consumerInfo.id,
        producerId: consumerInfo.producerId,
        kind: consumerInfo.kind,
        rtpParameters: consumerInfo.rtpParameters,
        appData: consumerInfo.appData as { user: Iuser },
      });

      if (!clientRecvTransport || !device) {
        return console.warn(
          `Frontend: clientRecvTransport or device not ready to consume yet. Deferring consumer creation for producerId: ${consumerInfo.producerId}`
        );
      }

      addConsumer(consumer.id, consumer);

      consumer.on("transportclose", () => {
        removeConsumer(consumer.id);
      });

      consumer.on("@close", () => {
        removeConsumer(consumer.id);
      });

      consumer.on("trackended", () => {
        removeConsumer(consumer.id);
      });

      consumer.on("@resume", () => consumer.resume());

      consumer.on("@pause", () => consumer.pause());
    });
  }

  return { setupConsumer };
}
