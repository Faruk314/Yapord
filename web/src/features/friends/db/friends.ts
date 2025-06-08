import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getFriendRequestUserTag } from "../cache/friendRequests";
import { db, and, eq, or, ne, FriendTable, UserTable } from "@shared/drizzle";

async function getFriends(userId: string) {
  "use cache";

  cacheTag(getFriendRequestUserTag(userId));

  const friends = await db
    .select({
      id: UserTable.id,
      name: UserTable.name,
      email: UserTable.email,
      image: UserTable.image,
    })
    .from(FriendTable)
    .innerJoin(
      UserTable,
      or(
        eq(FriendTable.userAId, UserTable.id),
        eq(FriendTable.userBId, UserTable.id)
      )
    )
    .where(
      and(
        eq(FriendTable.status, "accepted"),
        or(eq(FriendTable.userAId, userId), eq(FriendTable.userBId, userId)),
        ne(UserTable.id, userId)
      )
    );

  return friends;
}

export { getFriends };
