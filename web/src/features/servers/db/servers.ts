"use server";

import { ServerTable } from "@shared/drizzle/schema";
import { db } from "@shared/drizzle/db";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import {
  getServerGlobalTag,
  getServerIdTag,
  revalidateServerCache,
} from "../cache/servers";
import { eq } from "drizzle-orm";
import { Server } from "../types/servers";
import { getChannelGlobalTag } from "@/features/channels/cache/channels";

async function getServers(userId: string) {
  "use cache";

  cacheTag(getServerGlobalTag(), getChannelGlobalTag());

  const data = await db
    .select({
      id: ServerTable.id,
      name: ServerTable.name,
      image: ServerTable.image,
    })
    .from(ServerTable)
    .where(eq(ServerTable.ownerId, userId));

  return data;
}

async function getServer(id: string) {
  "use cache";

  cacheTag(getServerIdTag(id));

  const server = await db.query.ServerTable.findFirst({
    columns: {
      id: true,
      name: true,
      image: true,
      ownerId: true,
    },
    where: eq(ServerTable.id, id),
  });

  return server;
}

async function insertServer(
  data: typeof ServerTable.$inferInsert,
  trx: Omit<typeof db, "$client">
) {
  const [newServer] = await trx
    .insert(ServerTable)
    .values(data)
    .onConflictDoNothing()
    .returning();

  if (newServer == null) throw new Error("Failed to create server");

  revalidateServerCache(newServer.id);

  return newServer;
}

async function updateServer(
  id: string,
  data: typeof ServerTable.$inferInsert,
  trx: Omit<typeof db, "$client">
) {
  const [updatedServer] = await trx
    .update(ServerTable)
    .set({
      ...data,
      image: data.image ?? ServerTable.image,
    })
    .where(eq(ServerTable.id, id))
    .returning();

  if (updatedServer == null) throw new Error("Failed to update server");

  revalidateServerCache(updatedServer.id);

  return updatedServer;
}

async function deleteServerImage(id: string, trx: Omit<typeof db, "$client">) {
  const [updatedServer] = await trx
    .update(ServerTable)
    .set({ image: null })
    .where(eq(ServerTable.id, id))
    .returning();

  if (updatedServer == null) throw new Error("Failed to delete server image");

  revalidateServerCache(updatedServer.id);

  return updatedServer;
}

async function deleteServer(
  id: string,
  trx: Omit<typeof db, "$client">
): Promise<Server> {
  const [deletedServer] = await trx
    .delete(ServerTable)
    .where(eq(ServerTable.id, id))
    .returning();

  if (deletedServer == null) throw new Error("Failed to delete server");

  revalidateServerCache(deletedServer.id);

  return deletedServer as Server;
}

export {
  getServers,
  getServer,
  insertServer,
  updateServer,
  deleteServerImage,
  deleteServer,
};
