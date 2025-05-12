import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { ChannelTable } from "./channel";
import { UserTable } from "./user";
import { relations } from "drizzle-orm";
import { id, createdAt, updatedAt } from "../schemaHelpers";

export const ChannelMessageTable = pgTable("channel_messages", {
  id,
  content: text().notNull(),
  channelId: uuid()
    .notNull()
    .references(() => ChannelTable.id, { onDelete: "cascade" }),
  senderId: uuid()
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});

export const channelMessageRelations = relations(
  ChannelMessageTable,
  ({ one }) => ({
    channel: one(ChannelTable, {
      fields: [ChannelMessageTable.channelId],
      references: [ChannelTable.id],
    }),
    user: one(UserTable, {
      fields: [ChannelMessageTable.senderId],
      references: [UserTable.id],
    }),
  })
);
