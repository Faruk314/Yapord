import { relations } from "drizzle-orm";
import { pgTable, text, pgEnum } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { UserOAuthAccountTable } from "./userOAuth";
import { ServerTable } from "./server";
import { ServerMemberTable } from "./serverMember";

export const userRoles = ["admin", "user"] as const;
export type UserRole = (typeof userRoles)[number];
export const userRoleEnum = pgEnum("user_roles", userRoles);

export const UserTable = pgTable("users", {
  id,
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text(),
  salt: text(),
  role: userRoleEnum().notNull().default("user"),
  image: text(),
  createdAt,
  updatedAt,
});

export const userRelations = relations(UserTable, ({ many }) => ({
  oAuthAccounts: many(UserOAuthAccountTable),
  ownedServers: many(ServerTable),
  serverMemberships: many(ServerMemberTable),
}));
