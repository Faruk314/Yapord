import { getOrCreateRouter } from "mediasoup/mediasoup";
import { getPeer } from "./peer";

async function createWebRtcTransport(
  channelId: string,
  peerId: string,
  type: "send" | "recv"
) {
  const router = await getOrCreateRouter(channelId);

  const peer = getPeer(peerId);

  if (!peer) {
    throw new Error("Peer state not found");
  }

  const transport = await router.createWebRtcTransport({
    listenIps: [{ ip: "127.0.0.1", announcedIp: undefined }],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
  });

  if (type === "send") {
    peer.sendTransport = transport;
  } else {
    peer.recvTransport = transport;
  }

  return {
    id: transport.id,
    iceParameters: transport.iceParameters,
    iceCandidates: transport.iceCandidates,
    dtlsParameters: transport.dtlsParameters,
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };
}

export { createWebRtcTransport };
