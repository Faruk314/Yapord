import { oAuthProviders } from "@/drizzle/schema";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createUserSession } from "@/features/auth/db/session";
import { connectUserToAccount } from "@/features/auth/db/oauth";
import { getOAuthClient } from "@/features/auth/utils/oauth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider: rawProvider } = await params;

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const provider = z.enum(oAuthProviders).parse(rawProvider);

  if (typeof code !== "string" || typeof state !== "string") {
    redirect(
      `/signIn?oauthError=${encodeURIComponent(
        "Failed to connect. Please try again."
      )}`
    );
  }

  const oAuthClient = getOAuthClient(provider);

  try {
    const oAuthUser = await oAuthClient.fetchUser(code, state);

    const user = await connectUserToAccount(oAuthUser, provider);

    await createUserSession(user);
  } catch (error) {
    console.error(error);

    redirect(
      `/signIn?oauthError=${encodeURIComponent(
        "Failed to connect. Please try again."
      )}`
    );
  }

  redirect("/home");
}
