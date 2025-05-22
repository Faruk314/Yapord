import { pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";
import { id, createdAt, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { ChatParticipantsTable } from "./chatParticipant";
import { ChatMessagesTable } from "./chatMessage";

export const chatTypes = ["private", "group"] as const;
export type ChatType = (typeof chatTypes)[number];
export const chatTypeEnum = pgEnum("chat_types", chatTypes);

export const ChatTable = pgTable("chats", {
  id,
  name: varchar("name", { length: 40 }),
  type: chatTypeEnum().notNull().default("private"),
  createdAt,
  updatedAt,
});

export const chatRelations = relations(ChatTable, ({ many }) => ({
  participants: many(ChatParticipantsTable),
  messages: many(ChatMessagesTable),
}));
