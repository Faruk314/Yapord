import { create } from "zustand";
import { Device, types } from "mediasoup-client";
import { Iconsumer } from "../types/mediasoup";

type MediasoupState = {
  device: Device | null;
  sendTransport: types.Transport | null;
  recvTransport: types.Transport | null;
  consumers: Map<string, Iconsumer>;
  localStream: MediaStream | null;
  setDevice: (device: Device) => void;
  setSendTransport: (transport: types.Transport) => void;
  setRecvTransport: (transport: types.Transport) => void;
  setLocalStream: (stream: MediaStream) => void;
  resetMediasoupState: () => void;
  addConsumer: (id: string, consumer: Iconsumer) => void;
  removeConsumer: (id: string) => void;
  clearConsumers: () => void;
};

export const useMediasoupStore = create<MediasoupState>((set) => ({
  device: null,
  sendTransport: null,
  recvTransport: null,
  consumers: new Map(),
  localStream: null,

  setDevice: (device) => set({ device }),
  setSendTransport: (sendTransport) => set({ sendTransport }),
  setRecvTransport: (recvTransport) => set({ recvTransport }),
  setLocalStream: (stream) => set({ localStream: stream }),

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
}));
