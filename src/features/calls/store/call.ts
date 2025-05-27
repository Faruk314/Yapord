import { Iuser } from "@/features/auth/types/user";
import { create } from "zustand";

type CallState = {
  callModalOpen: boolean;
  incomingCallInfo: Iuser | null;
  openCallModal: () => void;
  closeCallModal: () => void;
  setIncomingCallInfo: (data: Iuser) => void;
};

export const useCallStore = create<CallState>((set) => ({
  callModalOpen: false,
  incomingCallInfo: null,

  openCallModal: () => set({ callModalOpen: true }),

  closeCallModal: () => set({ callModalOpen: false }),

  setIncomingCallInfo: (data) => set({ incomingCallInfo: data }),
}));
