import { relations } from "drizzle-orm";
import { pgTable, uuid, pgEnum, primaryKey } from "drizzle-orm/pg-core";
import { ServerTable } from "./server";
import { UserTable } from "./user";
import { createdAt, updatedAt } from "../schemaHelpers";

export const serverRoles = ["admin", "member"] as const;
export type ServerRole = (typeof serverRoles)[number];
export const serverRoleEnum = pgEnum("server_roles", serverRoles);

export const ServerMemberTable = pgTable(
  "server_members",
  {
    userId: uuid()
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    serverId: uuid()
      .notNull()
      .references(() => ServerTable.id, { onDelete: "cascade" }),
    role: serverRoleEnum().notNull().default("member"),
    createdAt,
    updatedAt,
  },
  (table) => [primaryKey({ columns: [table.userId, table.serverId] })]
);

export const serverMemberRelations = relations(
  ServerMemberTable,
  ({ one }) => ({
    server: one(ServerTable, {
      fields: [ServerMemberTable.serverId],
      references: [ServerTable.id],
    }),
    user: one(UserTable, {
      fields: [ServerMemberTable.userId],
      references: [UserTable.id],
    }),
  })
);
