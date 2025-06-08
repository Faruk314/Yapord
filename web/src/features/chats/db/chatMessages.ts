"use server";

import { db, ChatMessagesTable, eq, asc } from "@shared/drizzle";

async function getChatMessages(chatId: string, page = 0) {
  const limit = 40;
  const offset = page * limit;

  const messages = await db
    .select({
      id: ChatMessagesTable.id,
      content: ChatMessagesTable.content,
      createdAt: ChatMessagesTable.createdAt,
      senderId: ChatMessagesTable.senderId,
    })
    .from(ChatMessagesTable)
    .where(eq(ChatMessagesTable.chatId, chatId))
    .orderBy(asc(ChatMessagesTable.createdAt))
    .limit(limit)
    .offset(offset);

  const nextPage = messages.length === limit ? page + 1 : null;

  return { messages, currentPage: page, nextPage };
}

async function insertChatMessage(data: typeof ChatMessagesTable.$inferInsert) {
  const [newChatMessage] = await db
    .insert(ChatMessagesTable)
    .values(data)
    .onConflictDoNothing()
    .returning();

  if (newChatMessage == null) throw new Error("Failed to insert chat message");

  return newChatMessage;
}

export { getChatMessages, insertChatMessage };
