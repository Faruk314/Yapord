import { create } from "zustand";
import { IserverMember } from "../types/servers";

type ServerState = {
  serverMembers: IserverMember[];
  setServerMembers: (members: IserverMember[]) => void;
};

export const useServerStore = create<ServerState>((set) => ({
  serverMembers: [],

  setServerMembers: (members) => set({ serverMembers: members }),
}));
