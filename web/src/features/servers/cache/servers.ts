import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getServerGlobalTag() {
  return getGlobalTag("servers");
}

export function getServerIdTag(id: string) {
  return getIdTag("servers", id);
}

export function revalidateServerCache(id: string) {
  revalidateTag(getServerGlobalTag());
  revalidateTag(getServerIdTag(id));
}
