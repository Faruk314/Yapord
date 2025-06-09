import { ChannelType } from "../../drizzle/schema";
import { getUser, insertUser } from "../methods/user";
import { redisClient } from "../redis";

const ROOMS_KEY = "channel";

async function populateChannelsWithMembers(
  channels: { id: string; name: string; type: ChannelType }[]
): Promise<((typeof channels)[0] & { members: string[] })[]> {
  return await Promise.all(
    channels.map(async (channel) => {
      const redisKey = `${ROOMS_KEY}:${channel.id}:members`;

      const members = await redisClient.smembers(redisKey);
      if (!members) {
        throw new Error(`Failed to get members for channel ${channel.id}`);
      }

      return {
        ...channel,
        members,
      };
    })
  );
}

async function addChannelMember(channelId: string, userId: string) {
  const user = await getUser(userId);

  if (!user) throw new Error("User not found");

  const previousChannelId = user.channelId || null;

  if (previousChannelId === channelId) {
    throw new Error("User is already in this channel");
  }

  if (previousChannelId) {
    await redisClient.srem(`${ROOMS_KEY}:${previousChannelId}:members`, userId);
  }

  await redisClient.sadd(`${ROOMS_KEY}:${channelId}:members`, userId);

  user.channelId = channelId;

  await insertUser(user);

  return { previousChannelId };
}

async function removeChannelMember(channelId: string, userId: string) {
  await redisClient.srem(`${ROOMS_KEY}:${channelId}:members`, userId);

  const user = await getUser(userId);

  if (user && user.channelId === channelId) {
    user.channelId = null;
    await insertUser(user);
  }

  return user;
}

async function addChannelToServerSet(channelId: string, serverId: string) {
  return await redisClient.sadd(`server:${serverId}:channels`, channelId);
}

export {
  populateChannelsWithMembers,
  addChannelMember,
  removeChannelMember,
  addChannelToServerSet,
};
