import { Ipeer } from "types/mediasoup";

const peers: Map<string, Ipeer> = new Map();

function createPeer(peerId: string, userId: string, channelId: string) {
  const peer = {
    id: peerId,
    userId,
    channelId,
    producers: new Map(),
    consumers: new Map(),
  };

  peers.set(peerId, peer);
}

function deletePeer(peerId: string) {
  peers.delete(peerId);
}

function getPeer(peerId: string) {
  return peers.get(peerId);
}

function cleanupPeerResources(peerId: string) {
  const peer = getPeer(peerId);

  if (!peer) {
    throw new Error("Cleanup skipped peer does not exist");
  }

  peer.producers.forEach((producer) => producer.close());

  peer.producers.clear();

  peer.consumers.forEach((consumer) => consumer.close());

  peer.consumers.clear();

  peer.sendTransport?.close();

  peer.recvTransport?.close();

  deletePeer(peerId);
}

export { peers, createPeer, deletePeer, getPeer, cleanupPeerResources };
