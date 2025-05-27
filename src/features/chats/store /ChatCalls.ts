import { create } from "zustand";

type ChatCallState = {
  callModalOpen: boolean;
  openCallModal: () => void;
  closeCallModal: () => void;
};

export const useChatCallStore = create<ChatCallState>((set) => ({
  callModalOpen: false,

  openCallModal: () => set({ callModalOpen: true }),

  closeCallModal: () => set({ callModalOpen: false }),
}));
