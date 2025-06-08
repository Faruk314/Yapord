"use server";

import { getUserFromSession } from "../db/session";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getUser } from "../db/user";
import { userSchema } from "../schemas/user";
import { canUpdateUser } from "../permissions/user";
import { z } from "zod";
import { createUniqueFileNames } from "@/lib/utils";
import { uploadImagesToMinio } from "@/features/images/db/images";
import { updateUser as updateUserDb } from "../db/user";
import { db } from "@/drizzle/db";

type FullUser = Exclude<Awaited<ReturnType<typeof getUser>>, undefined | null>;

type User = Exclude<
  Awaited<ReturnType<typeof getUserFromSession>>,
  undefined | null
>;

function _getCurrentUser(options: {
  withFullUser: true;
  redirectIfNotFound: true;
}): Promise<FullUser>;
function _getCurrentUser(options: {
  withFullUser: true;
  redirectIfNotFound?: false;
}): Promise<FullUser | null>;
function _getCurrentUser(options: {
  withFullUser?: false;
  redirectIfNotFound: true;
}): Promise<User>;
function _getCurrentUser(options?: {
  withFullUser?: false;
  redirectIfNotFound?: false;
}): Promise<User | null>;
async function _getCurrentUser({
  withFullUser = false,
  redirectIfNotFound = false,
} = {}) {
  const user = await getUserFromSession();

  if (user == null) {
    if (redirectIfNotFound) return redirect("/signIn");

    return null;
  }

  if (withFullUser) {
    const fullUser = await getUser(user.id);
    // This should never happen
    if (fullUser == null) throw new Error("User not found in database");

    return fullUser;
  }

  return user;
}

export const getCurrentUser = cache(_getCurrentUser);

async function updateUser(
  userId: string,
  unsafeData: z.infer<typeof userSchema>
) {
  const { success, data } = userSchema.safeParse(unsafeData);

  if (!success) {
    return { error: true, message: "There was an error updating your profile" };
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { error: true, message: "There was an error updating your profile" };
  }

  if (!canUpdateUser(currentUser.id, userId)) {
    return { error: true, message: "There was an error updating your profile" };
  }

  try {
    const imageUrls =
      data.image && typeof data.image !== "string"
        ? createUniqueFileNames([data.image])
        : [];

    const userData = {
      ...data,
      image: imageUrls[0] || null,
    };

    await db.transaction(async (trx) => {
      await updateUserDb(userId, userData, trx);

      if (data.image && typeof data.image !== "string") {
        await uploadImagesToMinio([data.image], imageUrls);
      }
    });

    return { error: false, message: "Successfully updated your profile" };
  } catch {
    return { error: true, message: "Unable to update your profile" };
  }
}

export { updateUser };
