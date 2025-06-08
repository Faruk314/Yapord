import { create } from "zustand";
import { IserverMember } from "../types/servers";

type ServerState = {
  serverMembers: IserverMember[];
  setServerMembers: (members: IserverMember[]) => void;
  getServerMember: (memberId: string) => IserverMember | undefined;
};

export const useServerStore = create<ServerState>((set, get) => ({
  serverMembers: [],

  setServerMembers: (members) => set({ serverMembers: members }),

  getServerMember: (memberId) => {
    const members = get().serverMembers;
    return members.find((member) => member.id === memberId);
  },
}));
