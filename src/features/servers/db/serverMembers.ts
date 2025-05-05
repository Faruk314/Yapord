import { ServerMemberTable } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";

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

  return newMember;
}

export { getServerMember, insertServerMember };
