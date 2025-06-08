import { Iuser } from "@/features/auth/types/user";
import { create } from "zustand";

type CallState = {
  callModalOpen: boolean;
  incomingCallInfo: { channelId: string; senderInfo: Iuser } | undefined;
  openCallModal: () => void;
  closeCallModal: () => void;
  setIncomingCallInfo: (data: { channelId: string; senderInfo: Iuser }) => void;
};

export const useCallStore = create<CallState>((set) => ({
  callModalOpen: false,
  incomingCallInfo: undefined,

  openCallModal: () => set({ callModalOpen: true }),

  closeCallModal: () => set({ callModalOpen: false }),

  setIncomingCallInfo: (data) => set({ incomingCallInfo: data }),
}));
