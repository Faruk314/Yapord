import { db } from "@/drizzle/db";
import { FriendTable } from "@/drizzle/schema";
import { revalidateFriendCache } from "../cache/friendRequests";
import { and, eq, or } from "drizzle-orm";

async function insertFriendRequest(data: typeof FriendTable.$inferInsert) {
  const [newFriendRequest] = await db
    .insert(FriendTable)
    .values(data)
    .onConflictDoNothing()
    .returning();

  if (newFriendRequest == null)
    throw new Error("Failed to insert friend request");

  revalidateFriendCache({ userId: newFriendRequest.userAId });

  return newFriendRequest;
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

export { insertFriendRequest, checkFriendRequestExistance };
