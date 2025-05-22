import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { ChatTable } from "./chat";
import { UserTable } from "./user";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";

export const ChatMessagesTable = pgTable("chat_messages", {
  id,
  chatId: uuid("chat_id")
    .notNull()
    .references(() => ChatTable.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  content: text().notNull(),
  createdAt,
  updatedAt,
});

export const ChatMessagesRelations = relations(
  ChatMessagesTable,
  ({ one }) => ({
    sender: one(UserTable, {
      fields: [ChatMessagesTable.senderId],
      references: [UserTable.id],
    }),
    chat: one(ChatTable, {
      fields: [ChatMessagesTable.chatId],
      references: [ChatTable.id],
    }),
  })
);
