import { defineConfig } from "drizzle-kit";
import { env } from "./src/data/env/server";

export default defineConfig({
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/schema.ts",
  strict: true,
  verbose: true,
  dialect: "postgresql",
  dbCredentials: {
    password: env.DB_PASSWORD,
    user: env.DB_USER,
    database: env.DB_NAME,
    host: env.DB_HOST,
    port: env.DB_PORT,
    ssl: false,
  },
});
