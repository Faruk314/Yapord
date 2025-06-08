import {
  getChannelIdTag,
  getChannelServerTag,
  revalidateChannelCache,
} from "../cache/channels";
import { db, eq, ChannelTable } from "@shared/drizzle";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getChannelMessagesChannelTag } from "../cache/channelMessages";
import { populateChannelsWithMembers } from "./redis/channelRooms";

async function getChannels(serverId: string) {
  "use cache";

  cacheTag(getChannelServerTag(serverId));

  const channels = await db
    .select({
      id: ChannelTable.id,
      name: ChannelTable.name,
      type: ChannelTable.type,
    })
    .from(ChannelTable)
    .where(eq(ChannelTable.serverId, serverId));

  return await populateChannelsWithMembers(channels);
}

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

export { getChannels, getChannel, insertChannel };
