import { getUserFromSession } from "@/features/auth/db/session";
import { cache } from "react";
import { getServerMember } from "../db/serverMembers";

async function _getCurrentServerMember() {
  const user = await getUserFromSession();

  if (user == null) {
    return null;
  }

  const serverMember = await getServerMember(user.id);

  if (serverMember == null)
    throw new Error("Server member not found in database");

  return serverMember;
}

export const getCurrentServerMember = cache(_getCurrentServerMember);
