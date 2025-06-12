import { create } from "zustand";
import { Device, types } from "mediasoup-client";
import { Iconsumer } from "../types/mediasoup";

type ProducerMediaType = "webcam" | "screen" | "mic";

type MediasoupState = {
  device: Device | null;
  sendTransport: types.Transport | null;
  recvTransport: types.Transport | null;
  consumers: Map<string, Iconsumer>;
  producers: Map<ProducerMediaType, types.Producer>;
  localStreams: Map<ProducerMediaType, MediaStream>;

  setDevice: (device: Device | null) => void;

  setSendTransport: (transport: types.Transport | null) => void;
  setRecvTransport: (transport: types.Transport | null) => void;

  resetMediasoupState: () => void;

  addConsumer: (id: string, consumer: Iconsumer) => void;
  removeConsumer: (id: string) => void;
  clearConsumers: () => void;

  addProducer: (type: ProducerMediaType, producer: types.Producer) => void;
  removeProducer: (type: ProducerMediaType) => void;
  getProducer: (type: ProducerMediaType) => types.Producer | undefined;
  clearProducers: () => void;

  addLocalStream: (type: ProducerMediaType, stream: MediaStream) => void;
  removeLocalStream: (type: ProducerMediaType) => void;
  getLocalStream: (type: ProducerMediaType) => MediaStream | undefined;
};

export const useMediasoupStore = create<MediasoupState>((set, get) => ({
  device: null,
  sendTransport: null,
  recvTransport: null,
  consumers: new Map(),
  producers: new Map(),
  localStreams: new Map(),

  setDevice: (device) => set({ device }),
  setSendTransport: (sendTransport) => set({ sendTransport }),
  setRecvTransport: (recvTransport) => set({ recvTransport }),

  resetMediasoupState: () =>
    set({
      device: null,
      sendTransport: null,
      recvTransport: null,
      consumers: new Map(),
    }),

  addConsumer: (id, consumer) =>
    set((state) => {
      const newConsumersMap = new Map(state.consumers);
      newConsumersMap.set(id, consumer);
      return { consumers: newConsumersMap };
    }),

  removeConsumer: (id) =>
    set((state) => {
      const newConsumersMap = new Map(state.consumers);
      newConsumersMap.delete(id);
      return { consumers: newConsumersMap };
    }),

  clearConsumers: () => set({ consumers: new Map() }),

  addProducer: (type, producer) =>
    set((state) => {
      const newProducersMap = new Map(state.producers);
      newProducersMap.set(type, producer);
      return { producers: newProducersMap };
    }),

  removeProducer: (type) =>
    set((state) => {
      const newProducersMap = new Map(state.producers);
      newProducersMap.delete(type);
      return { producers: newProducersMap };
    }),

  getProducer: (type) => {
    return get().producers.get(type);
  },

  clearProducers: () => set({ producers: new Map() }),

  addLocalStream: (type, stream) => {
    const localStreams = new Map(get().localStreams);
    localStreams.set(type, stream);
    set({ localStreams });
  },

  removeLocalStream: (type) => {
    const localStreams = new Map(get().localStreams);
    localStreams.delete(type);
    set({ localStreams });
  },

  getLocalStream: (type) => get().localStreams.get(type),
}));
