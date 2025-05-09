import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { id, createdAt, updatedAt } from "../schemaHelpers";
import { ServerTable } from "./server";
import { relations } from "drizzle-orm";

export const channelTypes = ["voice", "text"] as const;
export type ChannelType = (typeof channelTypes)[number];
export const channelTypeEnum = pgEnum("channel_types", channelTypes);

export const ChannelTable = pgTable("channels", {
  id,
  name: text().notNull(),
  type: channelTypeEnum().notNull(),
  serverId: uuid()
    .notNull()
    .references(() => ServerTable.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});

export const channelRelations = relations(ChannelTable, ({ one }) => ({
  server: one(ServerTable, {
    fields: [ChannelTable.serverId],
    references: [ServerTable.id],
  }),
}));
