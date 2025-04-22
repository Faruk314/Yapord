import { pgTable, text, pgEnum } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";

export const userRoles = ["admin", "user"] as const;
export type UserRole = (typeof userRoles)[number];
export const userRoleEnum = pgEnum("user_roles", userRoles);

export const UserTable = pgTable("users", {
  id,
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
  salt: text().notNull(),
  role: userRoleEnum().notNull().default("admin"),
  image: text(),
  createdAt,
  updatedAt,
});
