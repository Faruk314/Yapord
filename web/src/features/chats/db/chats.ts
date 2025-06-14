import { db, ChatTable, eq } from "@shared/drizzle";

async function getChatByKey(chatKey: string) {
  return await db.query.ChatTable.findFirst({
    where: eq(ChatTable.chatKey, chatKey),
    columns: {
      id: true,
    },
  });
}

async function insertChat(
  data: typeof ChatTable.$inferInsert,
  trx: Omit<typeof db, "$client">
) {
  const [newChat] = await trx
    .insert(ChatTable)
    .values(data)
    .onConflictDoNothing()
    .returning();

  if (newChat == null) throw new Error("Failed to insert channel");

  return newChat;
}

export { getChatByKey, insertChat };
