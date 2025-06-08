"use server";

import { db } from "@shared/drizzle/db";
import { deleteServerImage } from "../../servers/db/servers";
import { deleteImagesFromMinio } from "../db/images";

async function deleteImages({
  serverId,
  images,
}: {
  serverId?: string;
  images: string[];
  userId?: string;
}) {
  try {
    await db.transaction(async (trx) => {
      if (serverId) await deleteServerImage(serverId, trx);

      await deleteImagesFromMinio(images);
    });

    return { error: false, message: "Successfully deleted" };
  } catch {
    return { error: true, message: "Failed to delete" };
  }
}

export { deleteImages };
