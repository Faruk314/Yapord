import { createWorker, types } from "mediasoup";

const userTransportMap = new Map<
  string,
  {
    send: types.WebRtcTransport;
    recv: types.WebRtcTransport;
  }
>();
const userProducerMap = new Map<string, types.Producer>();
const userConsumerMap = new Map<string, types.Consumer[]>();

type MediasoupState = {
  worker: types.Worker;
  routerMap: Map<string, types.Router>;
};

const mediasoupState: MediasoupState = {
  worker: null!,
  routerMap: new Map(),
};

const mediaCodecs: types.RtpCodecCapability[] = [
  {
    kind: "audio",
    mimeType: "audio/opus",
    clockRate: 48000,
    channels: 2,
  },
  {
    kind: "video",
    mimeType: "video/VP8",
    clockRate: 90000,
    parameters: {},
  },
];

async function initMediasoupWorker() {
  if (mediasoupState.worker) return mediasoupState;

  mediasoupState.worker = await createWorker({
    rtcMinPort: 40000,
    rtcMaxPort: 49999,
    logLevel: "warn",
  });

  mediasoupState.worker.on("died", () => {
    console.error("Mediasoup worker died. Restart server.");
    process.exit(1);
  });

  return mediasoupState;
}

async function getOrCreateRouter(channelId: string) {
  if (mediasoupState.routerMap.has(channelId)) {
    return mediasoupState.routerMap.get(channelId)!;
  }

  const router = await mediasoupState.worker.createRouter({ mediaCodecs });
  mediasoupState.routerMap.set(channelId, router);

  return router;
}

export {
  initMediasoupWorker,
  getOrCreateRouter,
  userTransportMap,
  userProducerMap,
  userConsumerMap,
};
