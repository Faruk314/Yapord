import { env } from "@/data/env/server";
import { z } from "zod";
import crypto from "crypto";
import { OAuthProvider } from "@/drizzle/schema";
import {
  InvalidStateError,
  InvalidTokenError,
  InvalidUserError,
} from "./oauthErrors";
import {
  createCodeVerifier,
  createState,
  getCodeVerifier,
  validateState,
} from "../utils/oauth";

class OAuthClient<T> {
  private readonly provider: OAuthProvider;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly scopes: string[];
  private readonly urls: {
    auth: string;
    token: string;
    user: string;
  };

  private readonly userInfo: {
    schema: z.ZodSchema<T>;
    parser: (data: T) => { id: string; email: string; name: string };
  };
  private readonly tokenSchema = z.object({
    access_token: z.string(),
    token_type: z.string(),
  });

  constructor({
    provider,
    clientId,
    clientSecret,
    scopes,
    urls,
    userInfo,
  }: {
    provider: OAuthProvider;
    clientId: string;
    clientSecret: string;
    scopes: string[];
    urls: {
      auth: string;
      token: string;
      user: string;
    };
    userInfo: {
      schema: z.ZodSchema<T>;
      parser: (data: T) => { id: string; email: string; name: string };
    };
  }) {
    this.provider = provider;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.scopes = scopes;
    this.urls = urls;
    this.userInfo = userInfo;
  }

  private get redirectUrl() {
    return new URL(this.provider, env.OAUTH_REDIRECT_URL_BASE);
  }

  async createAuthUrl() {
    const state = await createState();
    const codeVerifier = await createCodeVerifier();
    const hash = crypto.createHash("sha256").update(codeVerifier).digest();
    const url = new URL(this.urls.auth);
    url.searchParams.set("client_id", this.clientId);
    url.searchParams.set("redirect_uri", this.redirectUrl.toString());
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", this.scopes.join(" "));
    url.searchParams.set("state", state);
    url.searchParams.set("code_challenge_method", "S256");
    url.searchParams.set(
      "code_challenge",
      hash
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "")
    );
    return url.toString();
  }

  async fetchUser(code: string, state: string) {
    const isValidState = await validateState(state);

    if (!isValidState) throw new InvalidStateError();

    const { accessToken, tokenType } = await this.fetchToken(
      code,
      await getCodeVerifier()
    );

    const user = await fetch(this.urls.user, {
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then(async (rawData) => {
        if (!rawData.email && this.provider === "github") {
          const emails = await fetch("https://api.github.com/user/emails", {
            headers: {
              Authorization: `${tokenType} ${accessToken}`,
              Accept: "application/vnd.github+json",
            },
          }).then((res) => res.json());

          const primaryEmail = emails.find(
            (email: { primary: boolean; verified: boolean }) =>
              email.primary && email.verified
          );

          if (!primaryEmail) {
            throw new Error("No verified email found on GitHub");
          }

          rawData.email = primaryEmail.email;
        }

        const { data, success, error } =
          this.userInfo.schema.safeParse(rawData);

        if (!success) throw new InvalidUserError(error);

        return data;
      });

    return this.userInfo.parser(user);
  }

  private async fetchToken(code: string, codeVerifier: string) {
    return fetch(this.urls.token, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        code,
        redirect_uri: this.redirectUrl.toString(),
        grant_type: "authorization_code",
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code_verifier: codeVerifier,
      }),
    })
      .then((res) => res.json())
      .then((rawData) => {
        const { data, success, error } = this.tokenSchema.safeParse(rawData);
        if (!success) throw new InvalidTokenError(error);

        return {
          accessToken: data.access_token,
          tokenType: data.token_type,
        };
      });
  }
}

export { OAuthClient };
