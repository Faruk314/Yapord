"use server";
import { z } from "zod";
import { channelSchema } from "../schemas/channel";
import { insertChannel as insertChannelDb } from "../db/channels";
import { canCreateChannels } from "../permissions/channels";
import { getCurrentServerMember } from "@/features/servers/actions/serverMembers";

async function createChannel(
  serverId: string,
  unsafeData: z.infer<typeof channelSchema>
) {
  const { success, data } = channelSchema.safeParse(unsafeData);

  if (!success || !canCreateChannels(await getCurrentServerMember())) {
    return { error: true, message: "Unable to create channel" };
  }

  try {
    await insertChannelDb({ ...data, serverId });

    return { error: false, message: "Successfully created your channel" };
  } catch (error) {
    console.error(error);
    return { error: true, message: "Unable to create channel" };
  }
}

export { createChannel };
