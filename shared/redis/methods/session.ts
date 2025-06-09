import { redisClient } from "../redis";
import { z } from "zod";
import { userRoles } from "../../drizzle";

export const sessionSchema = z.object({
  id: z.string(),
  role: z.enum(userRoles),
});

export async function getUserSessionById(sessionId: string) {
  const rawUser = await redisClient.get(`session:${sessionId}`);

  if (!rawUser) return null;

  const parsedUser = JSON.parse(rawUser);

  const { success, data: user } = sessionSchema.safeParse(parsedUser);

  return success ? user : null;
}
