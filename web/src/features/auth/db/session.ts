import { sessionSchema } from "../schemas/session";
import { z } from "zod";
import crypto from "crypto";
import { cookies } from "next/headers";
import { redisClient } from "@/redis/redis";

const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;

const COOKIE_SESSION_KEY = "session-id";

export async function createUserSession(user: z.infer<typeof sessionSchema>) {
  const sessionId = crypto.randomBytes(512).toString("hex").normalize();

  await redisClient.set(
    `session:${sessionId}`,
    JSON.stringify(sessionSchema.parse(user)),
    "EX",
    SESSION_EXPIRATION_SECONDS
  );

  await setCookie(sessionId);
}

export async function removeUserFromSession() {
  const COOKIES = await cookies();

  const sessionId = COOKIES.get(COOKIE_SESSION_KEY)?.value;

  if (sessionId == null) return null;

  await redisClient.del(`session:${sessionId}`);

  COOKIES.delete(COOKIE_SESSION_KEY);
}

export async function getUserFromSession() {
  const COOKIES = await cookies();

  const sessionId = COOKIES.get(COOKIE_SESSION_KEY)?.value;

  if (sessionId == null) return null;

  return getUserSessionById(sessionId);
}

export async function getUserSessionById(sessionId: string) {
  const rawUser = await redisClient.get(`session:${sessionId}`);

  if (!rawUser) return null;

  const parsedUser = JSON.parse(rawUser);

  const { success, data: user } = sessionSchema.safeParse(parsedUser);

  return success ? user : null;
}

export async function updateUserSessionExpiration() {
  const COOKIES = await cookies();

  const sessionId = COOKIES.get(COOKIE_SESSION_KEY)?.value;

  if (sessionId == null) return;

  const user = await getUserSessionById(sessionId);

  if (user == null) return;

  await redisClient.set(
    `session:${sessionId}`,
    JSON.stringify(sessionSchema.parse(user)),
    "EX",
    SESSION_EXPIRATION_SECONDS
  );

  await setCookie(sessionId);
}

async function setCookie(sessionId: string) {
  const COOKIES = await cookies();

  COOKIES.set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
  });
}
