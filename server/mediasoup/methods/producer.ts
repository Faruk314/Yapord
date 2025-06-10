import { Producer } from "mediasoup/node/lib/types";
import { Socket } from "socket.io";
import { Ipeer } from "types/mediasoup";

function setupProducerListeners(
  socket: Socket,
  peer: Ipeer,
  producer: Producer
) {
  const channelId = peer.channelId;

  producer.on("transportclose", () => {
    peer.producers.delete(producer.id);

    socket.to(channelId).emit("producerClosed", { producerId: producer.id });
  });

  producer.on("@close", () => {
    peer.producers.delete(producer.id);

    socket.to(channelId).emit("producerClosed", { producerId: producer.id });
  });
}

export { setupProducerListeners };
