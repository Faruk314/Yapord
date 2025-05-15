import { redisClient } from "@/redis/redis";
import { IchannelRoom } from "../types/channel";
import { IserverMember } from "@/features/servers/types/servers";

const ROOMS_KEY = "channels";

async function createChannelRoom(roomId: string) {
  const roomExists = await redisClient.exists(`${ROOMS_KEY}:${roomId}`);

  if (roomExists) throw new Error("Channel with this id already exists");

  try {
    await redisClient.set(
      `${ROOMS_KEY}:${roomId}`,
      JSON.stringify({ roomId, users: [] })
    );
  } catch {
    throw new Error("Failed to create channel room");
  }
}

async function joinChannelRoom(joinedUser: IserverMember, roomId: string) {
  const roomJSON = await redisClient.get(`${ROOMS_KEY}:${roomId}`);

  if (!roomJSON) {
    throw new Error("Channel room does not exist");
  }

  const channelRoom: IchannelRoom = JSON.parse(roomJSON);

  const inChannelRoom = channelRoom.users.some(
    (user) => user.id === joinedUser.id
  );

  if (inChannelRoom) throw new Error("User is already in this channel");

  channelRoom.users.push(joinedUser);

  try {
    await redisClient.set(
      `${ROOMS_KEY}:${roomId}`,
      JSON.stringify(channelRoom)
    );
  } catch {
    throw new Error("Failed to join channel room");
  }
}

export { createChannelRoom, joinChannelRoom };
