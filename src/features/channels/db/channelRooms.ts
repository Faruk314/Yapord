import { redisClient } from "@/redis/redis";

const ROOMS_KEY = "channels";

async function createChannelRoom(roomId: string) {
  const roomExists = await redisClient.exists(`${ROOMS_KEY}:${roomId}`);

  if (roomExists) throw new Error("Channel with this id already exists");

  try {
    await redisClient.set(
      `${ROOMS_KEY}:${roomId}`,
      JSON.stringify({ roomId, users: {} })
    );
  } catch {
    throw new Error("Failed to create channel room");
  }
}

export { createChannelRoom };
