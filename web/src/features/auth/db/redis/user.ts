import { redisClient } from "@/redis/redis";
import { IredisUser } from "../../types/user";

const USERS_KEY = "users";

async function insertUser(user: IredisUser) {
  const { id } = user;

  try {
    await redisClient.hset(USERS_KEY, id, JSON.stringify(user));
  } catch {
    throw new Error("Error inserting user in redis");
  }
}

async function deleteUser(userId: string) {
  try {
    await redisClient.hdel(USERS_KEY, userId);
  } catch {
    throw new Error("Error deleting user from Redis");
  }
}

async function getUser(userId: string): Promise<IredisUser | null> {
  try {
    const userJSON = await redisClient.hget(USERS_KEY, userId);

    if (!userJSON) return null;

    return JSON.parse(userJSON);
  } catch {
    throw new Error("Error retrieving user from Redis");
  }
}

export { insertUser, deleteUser, getUser };
