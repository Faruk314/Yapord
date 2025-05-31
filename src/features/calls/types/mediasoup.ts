import { Iuser } from "@/features/auth/types/user";
import { types } from "mediasoup-client";

interface Itransport {
  id: string;
  iceParameters: types.IceParameters;
  iceCandidates: types.IceCandidate[];
  dtlsParameters: types.DtlsParameters;
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" }
  ];
}

interface ProducerAppData extends types.AppData {
  user: Iuser;
  channelId: string;
  isScreenShare?: boolean;
  mediaTag?: string;
}

interface Iconsumer {
  id: string;
  producerId: string;
  kind: types.MediaKind;
  rtpParameters: types.RtpParameters;
  type: types.Consumer;
  producerPaused: boolean;
  appData?: types.AppData;
}

type ConnectTransportCallback = (response?: { error: string } | null) => void;

export type {
  Itransport,
  ConnectTransportCallback,
  ProducerAppData,
  Iconsumer,
};
