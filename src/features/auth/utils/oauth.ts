import { OAuthProvider } from "@/drizzle/schema";
import {
  createDiscordOAuthClient,
  createGithubOAuthClient,
} from "../actions/oauth";
import { cookies } from "next/headers";
import { InvalidCodeVerifierError } from "../classes/oauthErrors";
import crypto from "crypto";

const STATE_COOKIE_KEY = "oAuthState";
const CODE_VERIFIER_COOKIE_KEY = "oAuthCodeVerifier";
const COOKIE_EXPIRATION_SECONDS = 60 * 10;

function getOAuthClient(provider: OAuthProvider) {
  switch (provider) {
    case "discord":
      return createDiscordOAuthClient();
    case "github":
      return createGithubOAuthClient();
    default:
      throw new Error(`Invalid provider: ${provider satisfies never}`);
  }
}

async function createState() {
  const COOKIES = await cookies();
  const state = crypto.randomBytes(64).toString("hex").normalize();
  COOKIES.set(STATE_COOKIE_KEY, state, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: Date.now() + COOKIE_EXPIRATION_SECONDS * 1000,
  });
  return state;
}

async function createCodeVerifier() {
  const COOKIES = await cookies();
  const codeVerifier = crypto.randomBytes(64).toString("hex").normalize();
  COOKIES.set(CODE_VERIFIER_COOKIE_KEY, codeVerifier, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: Date.now() + COOKIE_EXPIRATION_SECONDS * 1000,
  });
  return codeVerifier;
}

async function validateState(state: string) {
  const COOKIES = await cookies();
  const cookieState = COOKIES.get(STATE_COOKIE_KEY)?.value;
  return cookieState === state;
}

async function getCodeVerifier() {
  const COOKIES = await cookies();
  const codeVerifier = COOKIES.get(CODE_VERIFIER_COOKIE_KEY)?.value;
  if (codeVerifier == null) throw new InvalidCodeVerifierError();
  return codeVerifier;
}

export {
  getOAuthClient,
  createState,
  createCodeVerifier,
  validateState,
  getCodeVerifier,
};
