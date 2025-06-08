import { db } from "@/drizzle/db";
import { ChatParticipantsTable } from "@/drizzle/schema";
import { eq, ne } from "drizzle-orm";

export async function getChatParticipant(chatId: string, userId: string) {
  const participant = await db.query.ChatParticipantsTable.findFirst({
    where: (fields, operators) =>
      operators.and(eq(fields.chatId, chatId), ne(fields.userId, userId)),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return participant?.user;
}

export async function insertChatParticipants(
  chatId: string,
  participantIds: string[],
  trx: Omit<typeof db, "$client">
) {
  const values = participantIds.map((userId) => ({
    chatId,
    userId,
  }));

  await trx.insert(ChatParticipantsTable).values(values);
}
