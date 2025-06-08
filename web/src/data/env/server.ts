import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DISCORD_CLIENT_ID: z.string().min(1),
    DISCORD_CLIENT_SECRET: z.string().min(1),

    OAUTH_REDIRECT_URL_BASE: z.string().url(),

    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),

    MINIO_BUCKET_NAME: z.string().min(1),
    MINIO_ENDPOINT: z.string().min(1),
    MINIO_PORT: z.string().min(1).transform(Number),
    MINIO_ROOT_USER: z.string().min(1),
    MINIO_ROOT_PASSWORD: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
});
