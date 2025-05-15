import { redisClient } from "@/redis/redis";
import { IchannelRoom } from "../types/channel";
import { IserverMember } from "@/features/servers/types/servers";
import { getUser } from "@/features/auth/db/redis/user";

const ROOMS_KEY = "channels";
const USERS_KEY = "users";

async function createChannelRoom(roomId: string) {
  const roomExists = await redisClient.hexists(ROOMS_KEY, roomId);
  if (roomExists) throw new Error("Channel with this id already exists");

  try {
    const newRoom: IchannelRoom = { id: roomId, users: [] };
    await redisClient.hset(ROOMS_KEY, roomId, JSON.stringify(newRoom));
  } catch {
    throw new Error("Failed to create channel room");
  }
}

async function getChannelRoom(roomId: string) {
  const roomJSON = await redisClient.hget(ROOMS_KEY, roomId);

  if (!roomJSON) {
    throw new Error("Channel room does not exist");
  }

  const channelRoom: IchannelRoom = JSON.parse(roomJSON);

  return channelRoom;
}

async function joinChannelRoom(joinedUser: IserverMember, roomId: string) {
  const channelRoom = await getChannelRoom(roomId);

  const inChannelRoom = channelRoom.users.some(
    (user) => user.id === joinedUser.id
  );

  if (inChannelRoom) throw new Error("User is already in this channel");

  const existingUser = await getUser(joinedUser.id);

  if (!existingUser) throw new Error("User not found in Redis");

  if (existingUser.channelId) {
    await leaveChannelRoom(existingUser.channelId, joinedUser.id);
  }

  channelRoom.users.push(joinedUser);

  try {
    const updatedUser = { ...existingUser, channelId: roomId };
    const multi = redisClient.multi();

    multi.hset(ROOMS_KEY, roomId, JSON.stringify(channelRoom));
    multi.hset(USERS_KEY, joinedUser.id, JSON.stringify(updatedUser));

    await multi.exec();
  } catch {
    throw new Error("Failed to join channel room");
  }
}

async function leaveChannelRoom(roomId: string, userId: string) {
  const channelRoom = await getChannelRoom(roomId);

  const inChannelRoom = channelRoom.users.some((user) => user.id === userId);

  if (!inChannelRoom) throw new Error("User is not in this channel");

  const existingUser = await getUser(userId);

  if (!existingUser) throw new Error("User not found in Redis");

  channelRoom.users = channelRoom.users.filter((user) => user.id !== userId);

  try {
    const updatedUser = { ...existingUser, channelId: null };
    const multi = redisClient.multi();

    multi.hset(ROOMS_KEY, roomId, JSON.stringify(channelRoom));
    multi.hset(USERS_KEY, userId, JSON.stringify(updatedUser));

    await multi.exec();
  } catch {
    throw new Error("Failed to leave channel room");
  }
}

export { createChannelRoom, joinChannelRoom, leaveChannelRoom };
