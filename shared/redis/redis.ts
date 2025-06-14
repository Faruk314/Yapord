import { Redis } from "ioredis";
import { env } from "../data/env/server";

export const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
});
