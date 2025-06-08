import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getServerMembersGlobalTag() {
  return getGlobalTag("serverMembers");
}

export function getServerMembersIdTag(serverId: string) {
  return getIdTag("serverMembers", serverId);
}

export function revalidateServerMembersCache(serverId: string) {
  revalidateTag(getServerMembersGlobalTag());
  revalidateTag(getServerMembersIdTag(serverId));
}
