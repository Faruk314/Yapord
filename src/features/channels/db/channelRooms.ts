import { redisClient } from "@/redis/redis";
import { IchannelRoom } from "../types/channel";
import { IserverMember } from "@/features/servers/types/servers";

const ROOMS_KEY = "channels";

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

  channelRoom.users.push(joinedUser);

  try {
    await redisClient.hset(ROOMS_KEY, roomId, JSON.stringify(channelRoom));
  } catch {
    throw new Error("Failed to join channel room");
  }
}

async function leaveChannelRoom(roomId: string, userId: string) {
  const channelRoom = await getChannelRoom(roomId);

  const inChannelRoom = channelRoom.users.some((user) => user.id === userId);

  if (!inChannelRoom) throw new Error("User is not in this channel");

  channelRoom.users = channelRoom.users.filter((user) => user.id !== userId);

  try {
    await redisClient.hset(ROOMS_KEY, roomId, JSON.stringify(channelRoom));
  } catch {
    throw new Error("Failed to leave channel room");
  }
}

export { createChannelRoom, joinChannelRoom, leaveChannelRoom };
