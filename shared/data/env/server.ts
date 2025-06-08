import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DB_PASSWORD: z.string().min(1),
    DB_USER: z.string().min(1),
    DB_NAME: z.string().min(1),
    DB_HOST: z.string().min(1),
    DB_PORT: z.string().transform(Number),

    REDIS_URL: z.string().min(1),
    REDIS_PASSWORD: z.string().min(1),
    REDIS_PORT: z.string().min(1).transform(Number),
    REDIS_HOST: z.string().min(1),
  },
  runtimeEnv: process.env,
});
