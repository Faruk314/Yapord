import { Iuser } from "@/features/auth/types/user";
import { create } from "zustand";
import { TCall } from "../types/call";

type CallState = {
  callModalOpen: boolean;
  incomingCallInfo:
    | { channelId: string; senderInfo: Iuser; callType: TCall }
    | undefined;
  openCallModal: () => void;
  closeCallModal: () => void;
  setIncomingCallInfo: (data: {
    channelId: string;
    senderInfo: Iuser;
    callType: TCall;
  }) => void;
};

export const useCallStore = create<CallState>((set) => ({
  callModalOpen: false,
  incomingCallInfo: undefined,

  openCallModal: () => set({ callModalOpen: true }),

  closeCallModal: () => set({ callModalOpen: false }),

  setIncomingCallInfo: (data) => set({ incomingCallInfo: data }),
}));
