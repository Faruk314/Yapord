import { getUser, insertUser } from "@/features/auth/db/redis/user";
import { redisClient } from "@/redis/redis";

const ROOMS_KEY = "channel";

async function addChannelMember(channelId: string, userId: string) {
  const user = await getUser(userId);

  if (!user) throw new Error("User not found");

  if (user.channelId === channelId) {
    throw new Error("User is already in this channel");
  }

  if (user.channelId) {
    await redisClient.srem(`${ROOMS_KEY}:${user.channelId}:members`, userId);
  }

  await redisClient.sadd(`${ROOMS_KEY}:${channelId}:members`, userId);

  user.channelId = channelId;

  await insertUser(user);
}

async function removeChannelMember(channelId: string, userId: string) {
  await redisClient.srem(`${ROOMS_KEY}:${channelId}:members`, userId);

  const user = await getUser(userId);

  if (user && user.channelId === channelId) {
    user.channelId = null;
    await insertUser(user);
  }
}

export { addChannelMember, removeChannelMember };
