import { getUserFromSession } from "@/features/auth/db/session";
import { getServerMember } from "../db/serverMembers";
import { getUser } from "@/features/auth/db/user";
import { cache } from "react";
import { IserverMember } from "../types/servers";

type ServerMember = Exclude<
  Awaited<ReturnType<typeof getServerMember>>,
  undefined | null
>;

function _getCurrentServerMember(options: {
  withFullUser: true;
}): Promise<IserverMember | null>;
function _getCurrentServerMember(options?: {
  withFullUser?: false;
}): Promise<ServerMember | null>;

async function _getCurrentServerMember({
  withFullUser = false,
}: { withFullUser?: boolean } = {}) {
  const user = await getUserFromSession();

  if (!user) return null;

  const serverMember = await getServerMember(user.id);

  if (!serverMember) throw new Error("Server member not found in database");

  if (withFullUser) {
    const fullUser = await getUser(serverMember.userId);

    if (!fullUser) throw new Error("User not found in database");

    const fullServerMember: IserverMember = {
      id: fullUser.id,
      name: fullUser.name,
      image: fullUser.image,
      role: serverMember.role,
    };

    return fullServerMember;
  }

  return serverMember;
}

// Cached version for reuse
export const getCurrentServerMember = cache(_getCurrentServerMember);
