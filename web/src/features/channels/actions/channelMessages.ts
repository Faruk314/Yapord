"use server";

import { z } from "zod";
import { canCreateChannelMessages } from "../permissions/channels";
import { getCurrentServerMember } from "@/features/servers/actions/serverMembers";
import { channelMessageSchema } from "../schemas/channelMessage";
import { insertChannelMessage as insertChannelMessageDb } from "../db/channelMessages";

async function createChannelMessage(
  channelId: string,
  unsafeData: z.infer<typeof channelMessageSchema>
) {
  const { success, data } = channelMessageSchema.safeParse(unsafeData);

  if (!success || !canCreateChannelMessages(await getCurrentServerMember())) {
    return { error: true, message: "Unable to create message" };
  }

  try {
    const response = await insertChannelMessageDb({ ...data, channelId });

    const messageData = {
      id: response.id,
      content: response.content,
      createdAt: response.createdAt,
    };

    return {
      error: false,
      message: "Successfully created your message",
      messageData,
    };
  } catch {
    return {
      error: true,
      message: "Unable to create message",
      messageData: null,
    };
  }
}

export { createChannelMessage };
