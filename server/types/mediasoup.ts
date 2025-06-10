import { types } from "mediasoup";

interface Ipeer {
  id: string;
  userId: string;
  channelId: string;
  sendTransport?: types.WebRtcTransport;
  recvTransport?: types.WebRtcTransport;
  producers: Map<string, types.Producer>;
  consumers: Map<string, types.Consumer>;
}

type ConnectTransportCallback = (response?: { error: string } | null) => void;

export type { Ipeer, ConnectTransportCallback };
