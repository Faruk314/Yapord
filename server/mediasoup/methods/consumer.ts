import { Consumer } from "mediasoup/node/lib/ConsumerTypes";
import { Socket } from "socket.io";
import { Ipeer } from "types/mediasoup";

function setupConsumerListeners(
  socket: Socket,
  peer: Ipeer,
  consumer: Consumer
) {
  consumer.on("transportclose", () => {
    peer.consumers.delete(consumer.id);
  });

  consumer.on("producerclose", () => {
    consumer.close();

    peer.consumers.delete(consumer.id);

    socket.emit("consumerClosed", {
      consumerId: consumer.id,
      producerId: consumer.producerId,
    });
  });

  consumer.on("producerpause", () => {
    consumer.pause();

    socket.emit("consumerResumed", { consumerId: consumer.id });
  });

  consumer.on("producerresume", () => {
    consumer.resume();
  });
}

export { setupConsumerListeners };
