import { ServerMemberTable, UserTable } from "@shared/drizzle/schema";
import { db } from "@shared/drizzle/db";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import {
  getServerMembersIdTag,
  revalidateServerMembersCache,
} from "../cache/serverMembers";

async function getServerMembers(serverId: string) {
  "use cache";

  cacheTag(getServerMembersIdTag(serverId));

  const members = await db
    .select({
      id: ServerMemberTable.userId,
      role: ServerMemberTable.role,
      name: UserTable.name,
      image: UserTable.image,
    })
    .from(ServerMemberTable)
    .where(eq(ServerMemberTable.serverId, serverId))
    .innerJoin(UserTable, eq(ServerMemberTable.userId, UserTable.id));

  return members;
}

async function getServerMember(userId: string) {
  return db.query.ServerMemberTable.findFirst({
    columns: { userId: true, role: true },
    where: eq(ServerMemberTable.userId, userId),
  });
}

async function insertServerMember(
  data: typeof ServerMemberTable.$inferInsert,
  trx: Omit<typeof db, "$client"> = db
) {
  const [newMember] = await trx
    .insert(ServerMemberTable)
    .values({
      userId: data.userId,
      serverId: data.serverId,
      role: data.role,
    })
    .onConflictDoNothing()
    .returning();

  if (!newMember) {
    throw new Error("Failed to insert server member");
  }

  revalidateServerMembersCache(data.serverId);

  return newMember;
}

export { getServerMembers, getServerMember, insertServerMember };
