"use server";

import { getCurrentUser } from "@/features/auth/actions/user";
import { createChatKey } from "../utils/chats";
import { getChatByKey, insertChat as insertChatDb } from "../db/chats";
import { redirect } from "next/navigation";
import { db } from "@shared/drizzle/db";
import { insertChatParticipants } from "../db/chatParticipants";
import { Ichat } from "../types/chats";

async function initializeChat(userB: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { error: true, message: "Unauthorized" };
  }

  const chatKey = createChatKey(user.id, userB);

  const chat = await getChatByKey(chatKey);

  if (chat) {
    return redirect(`/home/chat/${chat.id}`);
  }

  let newChat: Ichat | null = null;

  try {
    await db.transaction(async (trx) => {
      newChat = await insertChatDb({ chatKey }, trx);

      const chatParticipants = [user.id, userB];

      await insertChatParticipants(newChat.id, chatParticipants, trx);
    });
  } catch {
    return { error: true, message: "Unable to create chat" };
  }

  redirect(`/home/chat/${newChat!.id}`);
}

export { initializeChat };
