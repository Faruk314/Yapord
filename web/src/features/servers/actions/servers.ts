"use server";

import { z } from "zod";
import { serverSchema } from "../schemas/servers";
import {
  deleteImagesFromMinio,
  uploadImagesToMinio,
} from "../../images/db/images";
import { canUpdateServers, canDeleteServers } from "../permissions/servers";
import {
  insertServer,
  deleteServer as deleteServerDB,
  updateServer as updateServerDb,
} from "../db/servers";
import { db } from "@/drizzle/db";
import { createUniqueFileNames } from "@/lib/utils";
import { insertServerMember } from "../db/serverMembers";
import { getCurrentServerMember } from "./serverMembers";

async function createServer(
  ownerId: string,
  unsafeData: z.infer<typeof serverSchema>
) {
  const { success, data } = serverSchema.safeParse(unsafeData);

  if (!success) {
    return { error: true, message: "Unable to create server" };
  }

  try {
    const imageUrls =
      data.image && typeof data.image !== "string"
        ? createUniqueFileNames([data.image])
        : [];

    const serverData = {
      ...data,
      image: imageUrls[0] || null,
      ownerId,
    };

    await db.transaction(async (trx) => {
      const server = await insertServer(serverData, trx);

      await insertServerMember(
        { userId: ownerId, serverId: server.id, role: "owner" },
        trx
      );

      if (data.image && typeof data.image !== "string") {
        await uploadImagesToMinio([data.image], imageUrls);
      }
    });

    return { error: false, message: "Successfully created your server" };
  } catch (error) {
    console.error(error);
    return { error: true, message: "Unable to create server" };
  }
}

async function updateServer(
  id: string,
  ownerId: string,
  unsafeData: z.infer<typeof serverSchema>
) {
  const { success, data } = serverSchema.safeParse(unsafeData);

  if (!success || !canUpdateServers(await getCurrentServerMember())) {
    return { error: true, message: "There was an error updating your server" };
  }

  try {
    const imageUrls =
      data.image && typeof data.image !== "string"
        ? createUniqueFileNames([data.image])
        : [];

    const serverData = {
      ...data,
      image: imageUrls[0] || null,
      ownerId,
    };

    await db.transaction(async (trx) => {
      await updateServerDb(id, serverData, trx);

      if (data.image && typeof data.image !== "string") {
        await uploadImagesToMinio([data.image], imageUrls);
      }
    });

    return { error: false, message: "Successfully updated your server" };
  } catch {
    return { error: true, message: "Unable to update your server" };
  }
}

async function deleteServer(id: string) {
  if (!canDeleteServers(await getCurrentServerMember())) {
    return { error: true, message: "Error deleting your server" };
  }

  try {
    await db.transaction(async (trx) => {
      const data = await deleteServerDB(id, trx);

      if (data.image) await deleteImagesFromMinio([data.image]);
    });

    return { error: false, message: "Successfully deleted your server" };
  } catch {
    return { error: true, message: "Error deleting your server" };
  }
}

export { createServer, updateServer, deleteServer };
