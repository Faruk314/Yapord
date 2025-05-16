"use server";

import { z } from "zod";
import { channelSchema } from "../schemas/channel";
import { insertChannel as insertChannelDb } from "../db/channels";
import { canCreateChannels } from "../permissions/channels";
import { getCurrentServerMember } from "@/features/servers/actions/serverMembers";
import { db } from "@/drizzle/db";
import {
  addChannelMember,
  removeChannelMember,
} from "../db/redis/channelRooms";

async function createChannel(
  serverId: string,
  unsafeData: z.infer<typeof channelSchema>
) {
  const { success, data } = channelSchema.safeParse(unsafeData);

  if (!success || !canCreateChannels(await getCurrentServerMember())) {
    return { error: true, message: "Unable to create channel" };
  }

  try {
    await db.transaction(async (trx) => {
      await insertChannelDb({ ...data, serverId }, trx);
    });

    return { error: false, message: "Successfully created your channel" };
  } catch {
    return { error: true, message: "Unable to create channel" };
  }
}

async function joinChannel(channelId: string) {
  const serverMember = await getCurrentServerMember({ withFullUser: true });

  if (!serverMember) {
    return { error: true, message: "Unable to join channel" };
  }

  try {
    await addChannelMember(channelId, serverMember.id);

    return { error: false, message: "Successfully joined channel" };
  } catch {
    return { error: true, message: "Unable to join channel" };
  }
}

async function leaveChannel(channelId: string) {
  const serverMember = await getCurrentServerMember();

  if (!serverMember) {
    return { error: true, message: "Unable to leave channel" };
  }

  try {
    await removeChannelMember(channelId, serverMember.userId);

    return { error: false, message: "Successfully left the channel" };
  } catch {
    return { error: true, message: "Unable to leave channel" };
  }
}

export { createChannel, joinChannel, leaveChannel };
