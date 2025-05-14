import { db } from "@/drizzle/db";
import { ChannelTable } from "@/drizzle/schema";
import { getChannelIdTag, revalidateChannelCache } from "../cache/channels";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getChannelMessagesChannelTag } from "../cache/channelMessages";

async function getChannel(id: string) {
  "use cache";

  cacheTag(getChannelIdTag(id), getChannelMessagesChannelTag(id));

  const channel = await db.query.ChannelTable.findFirst({
    where: eq(ChannelTable.id, id),
    columns: {
      id: true,
      name: true,
      type: true,
    },
    with: {
      messages: {
        columns: {
          id: true,
          content: true,
          createdAt: true,
        },
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: (fields, operators) => operators.asc(fields.createdAt),
      },
    },
  });

  return channel;
}

async function insertChannel(
  data: typeof ChannelTable.$inferInsert,
  trx: Omit<typeof db, "$client">
) {
  const [newChannel] = await trx
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

export { insertChannel, getChannel };
