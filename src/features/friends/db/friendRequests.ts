import { db } from "@/drizzle/db";
import { FriendTable, UserTable } from "@/drizzle/schema";
import {
  getFriendRequestUserTag,
  revalidateFriendRequestsCache,
} from "../cache/friendRequests";
import { and, eq, or } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

async function getFriendRequests(recipientId: string) {
  "use cache";

  cacheTag(getFriendRequestUserTag(recipientId));

  const friendRequests = await db
    .select({
      id: UserTable.id,
      name: UserTable.name,
      email: UserTable.email,
      image: UserTable.image,
    })
    .from(FriendTable)
    .innerJoin(UserTable, eq(FriendTable.userAId, UserTable.id))
    .where(
      and(
        eq(FriendTable.userBId, recipientId),
        eq(FriendTable.status, "pending")
      )
    );

  return friendRequests;
}

async function insertFriendRequest(data: typeof FriendTable.$inferInsert) {
  const [newFriendRequest] = await db
    .insert(FriendTable)
    .values(data)
    .onConflictDoNothing()
    .returning();

  if (newFriendRequest == null)
    throw new Error("Failed to insert friend request");

  return newFriendRequest;
}

export async function acceptFriendRequest(userAId: string, userBId: string) {
  const [updatedFriend] = await db
    .update(FriendTable)
    .set({ status: "accepted" })
    .where(
      and(
        eq(FriendTable.userAId, userAId),
        eq(FriendTable.userBId, userBId),
        eq(FriendTable.status, "pending")
      )
    )
    .returning();

  if (updatedFriend == null) throw new Error("Failed to accept friend request");

  revalidateFriendRequestsCache({ userId: updatedFriend.userBId });

  return updatedFriend;
}

export async function deleteFriendRequest(userAId: string, userBId: string) {
  const [deletedFriend] = await db
    .delete(FriendTable)
    .where(
      and(
        eq(FriendTable.userAId, userAId),
        eq(FriendTable.userBId, userBId),
        eq(FriendTable.status, "pending")
      )
    )
    .returning();

  if (deletedFriend == null) throw new Error("Failed to delete friend request");

  revalidateFriendRequestsCache({ userId: deletedFriend.userBId });

  return deletedFriend;
}

async function checkFriendRequestExistance(
  firstUserId: string,
  secondUserId: string
) {
  const friendRequest = await db.query.FriendTable.findFirst({
    columns: {
      status: true,
    },
    where: or(
      and(
        eq(FriendTable.userAId, firstUserId),
        eq(FriendTable.userBId, secondUserId)
      ),
      and(
        eq(FriendTable.userAId, secondUserId),
        eq(FriendTable.userBId, firstUserId)
      )
    ),
  });

  return friendRequest;
}

export { getFriendRequests, insertFriendRequest, checkFriendRequestExistance };
