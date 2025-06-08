import { db } from "@/drizzle/db";
import { revalidateChannelMessageCache } from "../cache/channelMessages";
import { ChannelMessageTable } from "@/drizzle/schema";

async function insertChannelMessage(
  data: typeof ChannelMessageTable.$inferInsert
) {
  const [newMessage] = await db
    .insert(ChannelMessageTable)
    .values(data)
    .onConflictDoNothing()
    .returning();

  if (newMessage == null) throw new Error("Failed to insert channel message");

  revalidateChannelMessageCache({
    channelId: newMessage.channelId,
    messageId: newMessage.id,
  });

  return newMessage;
}

export { insertChannelMessage };
