import { db } from "@/drizzle/db";
import { ChannelTable } from "@/drizzle/schema";
import { revalidateChannelCache } from "../cache/channels";

async function insertChannel(data: typeof ChannelTable.$inferInsert) {
  const [newChannel] = await db
    .insert(ChannelTable)
    .values(data)
    .onConflictDoNothing()
    .returning();

  if (newChannel == null) throw new Error("Failed to insert channel");

  revalidateChannelCache({
    serverId: newChannel.serverId,
    channelId: newChannel.id,
  });

  return newChannel;
}

export { insertChannel };
