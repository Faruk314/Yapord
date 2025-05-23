import { z } from "zod";
import { chatMessageSchema } from "../schemas/chatMessage";
import { getCurrentUser } from "@/features/auth/actions/user";
import { insertChatMessage as insertChatMessageDb } from "../db/chatMessages";

async function createChatMessage(
  unsafeData: z.infer<typeof chatMessageSchema>
) {
  const { data, success } = chatMessageSchema.safeParse(unsafeData);

  if (!success) {
    return { error: true, message: "Unable to create message" };
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { error: true, message: "Unauthorized" };
  }

  try {
    const messageData = await insertChatMessageDb(data);

    return {
      error: false,
      message: "Message created successfully",
      data: messageData,
    };
  } catch {
    return { error: true, message: "Failed to create message" };
  }
}

export { createChatMessage };
