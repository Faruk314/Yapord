import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { ChatTable } from "./chat";
import { UserTable } from "./user";
import { relations } from "drizzle-orm";

export const ChatParticipantsTable = pgTable(
  "chat_participants",
  {
    chatId: uuid("chat_id")
      .notNull()
      .references(() => ChatTable.id, { onDelete: "cascade" }),

    userId: uuid("user_id")
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
  },

  (table) => [primaryKey({ columns: [table.chatId, table.userId] })]
);

export const ChatParticipantsRelations = relations(
  ChatParticipantsTable,
  ({ one }) => ({
    chat: one(ChatTable, {
      fields: [ChatParticipantsTable.chatId],
      references: [ChatTable.id],
    }),
    user: one(UserTable, {
      fields: [ChatParticipantsTable.userId],
      references: [UserTable.id],
    }),
  })
);
