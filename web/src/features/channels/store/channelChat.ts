import { create } from "zustand";
import { IchannelMessage } from "../types/channel";

type ChannelChatState = {
  channelMessages: IchannelMessage[];
  setMessages: (messages: IchannelMessage[]) => void;
  addMessage: (message: IchannelMessage) => void;
};

export const useChannelChatStore = create<ChannelChatState>((set) => ({
  channelMessages: [],

  setMessages: (messages) => set({ channelMessages: messages }),

  addMessage: (message) =>
    set((state) => ({
      channelMessages: [...state.channelMessages, message],
    })),
}));
