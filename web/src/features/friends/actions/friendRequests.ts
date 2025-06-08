"use server";

import { z } from "zod";
import { friendRequestSchema } from "../schemas/friendRequest";
import { getCurrentUser } from "@/features/auth/actions/user";
import { getUserByName } from "@/features/auth/db/user";
import {
  checkFriendRequestExistance,
  insertFriendRequest,
  acceptFriendRequest as acceptFriendRequestDb,
  deleteFriendRequest as deleteFriendRequestDb,
} from "../db/friendRequests";

async function createFriendRequest(
  unsafeData: z.infer<typeof friendRequestSchema>
) {
  const { success, data } = friendRequestSchema.safeParse(unsafeData);

  const currentUser = await getCurrentUser();

  if (!success || !currentUser) {
    return { error: true, message: "Invalid data or unauthorized" };
  }

  const recipient = await getUserByName(data.name);

  if (!recipient) {
    return { error: true, message: "User not found" };
  }

  if (currentUser.id === recipient.id)
    return { error: true, message: "Could not create friend request" };

  const requestExists = await checkFriendRequestExistance(
    currentUser.id,
    recipient.id
  );

  if (requestExists)
    return { error: true, message: "Friend request already exists" };

  try {
    await insertFriendRequest({
      userAId: currentUser.id,
      userBId: recipient.id,
    });

    return { error: false, message: "Friend request successfully sent" };
  } catch {
    return {
      error: true,
      message: "Server error. Could not create friend request",
    };
  }
}

export async function acceptFriendRequest(senderId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { error: true, message: "Unauthorized" };
  }

  try {
    await acceptFriendRequestDb(senderId, currentUser.id);

    return { error: false, message: "Friend request accepted" };
  } catch {
    return { error: true, message: "Error accepting friend request" };
  }
}

export async function rejectFriendRequest(senderId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { error: true, message: "Unauthorized" };
  }

  try {
    await deleteFriendRequestDb(senderId, currentUser.id);

    return { error: false, message: "Friend request rejected" };
  } catch {
    return { error: true, message: "Error rejecting friend request" };
  }
}

export { createFriendRequest };
