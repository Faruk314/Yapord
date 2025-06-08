import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_MINIO_CLIENT_URL: z.string().min(1),
    NEXT_PUBLIC_SITE_URL: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_MINIO_CLIENT_URL:
      process.env.NEXT_PUBLIC_MINIO_CLIENT_URL ?? "",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  },
});
