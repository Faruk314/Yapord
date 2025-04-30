"use server";

import { OAuthProvider } from "@/drizzle/schema";
import { redirect } from "next/navigation";
import { OAuthClient, getOAuthClient } from "../utils/oauth";
import { env } from "@/data/env/server";
import { z } from "zod";

async function oAuthSignIn(provider: OAuthProvider) {
  const client = getOAuthClient(provider);
  redirect(await client.createAuthUrl());
}

function createDiscordOAuthClient() {
  return new OAuthClient({
    provider: "discord",
    clientId: env.DISCORD_CLIENT_ID,
    clientSecret: env.DISCORD_CLIENT_SECRET,
    scopes: ["identify", "email"],
    urls: {
      auth: "https://discord.com/oauth2/authorize",
      token: "https://discord.com/api/oauth2/token",
      user: "https://discord.com/api/users/@me",
    },
    userInfo: {
      schema: z.object({
        id: z.string(),
        username: z.string(),
        global_name: z.string().nullable(),
        email: z.string().email(),
      }),
      parser: (user) => ({
        id: user.id,
        name: user.global_name ?? user.username,
        email: user.email,
      }),
    },
  });
}

function createGithubOAuthClient() {
  return new OAuthClient({
    provider: "github",
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    scopes: ["user:email", "read:user"],
    urls: {
      auth: "https://github.com/login/oauth/authorize",
      token: "https://github.com/login/oauth/access_token",
      user: "https://api.github.com/user",
    },
    userInfo: {
      schema: z.object({
        id: z.number(),
        name: z.string().nullable(),
        login: z.string(),
        email: z.string().email(),
      }),
      parser: (user) => ({
        id: user.id.toString(),
        name: user.name ?? user.login,
        email: user.email,
      }),
    },
  });
}

export { oAuthSignIn, createDiscordOAuthClient, createGithubOAuthClient };
