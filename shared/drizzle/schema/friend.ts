import { pgTable, uuid, pgEnum, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { UserTable } from "./user";
import { createdAt, updatedAt } from "../schemaHelpers";

export const friendshipStatuses = ["pending", "accepted"] as const;
export type FriendshipStatus = (typeof friendshipStatuses)[number];
export const friendshipStatusEnum = pgEnum(
  "friendship_status",
  friendshipStatuses
);

export const FriendTable = pgTable(
  "friends",
  {
    userAId: uuid("user_a_id")
      .notNull()
      .references(() => UserTable.id),
    userBId: uuid("user_b_id")
      .notNull()
      .references(() => UserTable.id),
    status: friendshipStatusEnum("status").notNull().default("pending"),
    createdAt,
    updatedAt,
  },

  (table) => [primaryKey({ columns: [table.userAId, table.userBId] })]
);

export const friendRelations = relations(FriendTable, ({ one }) => ({
  userA: one(UserTable, {
    fields: [FriendTable.userAId],
    references: [UserTable.id],
    relationName: "userA",
  }),
  userB: one(UserTable, {
    fields: [FriendTable.userBId],
    references: [UserTable.id],
    relationName: "userB",
  }),
}));
