import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { UserTable } from "./user";
import { id, createdAt, updatedAt } from "../schemaHelpers";
import { ServerMemberTable } from "./serverMember";
import { ChannelTable } from "./channel";

export const ServerTable = pgTable("servers", {
  id,
  name: text().notNull(),
  image: text(),
  ownerId: uuid()
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});

export const serverRelations = relations(ServerTable, ({ one, many }) => ({
  owner: one(UserTable, {
    fields: [ServerTable.ownerId],
    references: [UserTable.id],
  }),
  members: many(ServerMemberTable),
  channels: many(ChannelTable),
}));
