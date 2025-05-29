import { types } from "mediasoup-client";

interface Itransport {
  id: string;
  iceParameters: types.IceParameters;
  iceCandidates: types.IceCandidate[];
  dtlsParameters: types.DtlsParameters;
}

export type { Itransport };
