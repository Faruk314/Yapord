import { create } from "zustand";

type FriendRequestsState = {
  pendingFriendRequests: string[];
  setPendingFriendRequests: (friendRequests: string[]) => void;
  addPendingFriendRequest: (friendRequest: string) => void;
};

export const useFriendRequestStore = create<FriendRequestsState>((set) => ({
  pendingFriendRequests: [],

  setPendingFriendRequests: (friendRequests) =>
    set({ pendingFriendRequests: friendRequests }),

  addPendingFriendRequest: (friendRequest) =>
    set((state) => ({
      pendingFriendRequests: [...state.pendingFriendRequests, friendRequest],
    })),
}));
