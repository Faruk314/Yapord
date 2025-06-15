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

interface Iconsumer extends types.Consumer {
  appData: { user: Iuser; streamType: "screenShare" | "video" | "audio" };
}

export type { Itransport, ProducerAppData, Iconsumer };
