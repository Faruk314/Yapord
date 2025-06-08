import { create } from "zustand";

type ChannelMembersState = {
  channelMembersMap: Record<string, string[]>;

  setChannelMembers: (channelId: string, members: string[]) => void;
  addChannelMember: (channelId: string, member: string) => void;
  removeChannelMember: (channelId: string, member: string) => void;
};

export const useChannelMembersStore = create<ChannelMembersState>((set) => ({
  channelMembersMap: {},

  setChannelMembers: (channelId, members) =>
    set((state) => ({
      channelMembersMap: {
        ...state.channelMembersMap,
        [channelId]: members,
      },
    })),

  addChannelMember: (channelId, member) =>
    set((state) => {
      const existingMembers = state.channelMembersMap[channelId] || [];
      if (existingMembers.includes(member)) return {};
      return {
        channelMembersMap: {
          ...state.channelMembersMap,
          [channelId]: [...existingMembers, member],
        },
      };
    }),

  removeChannelMember: (channelId, member) =>
    set((state) => {
      const existingMembers = state.channelMembersMap[channelId] || [];
      return {
        channelMembersMap: {
          ...state.channelMembersMap,
          [channelId]: existingMembers.filter((m) => m !== member),
        },
      };
    }),
}));
