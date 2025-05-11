import { getGlobalTag, getIdTag, getServerTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getChannelGlobalTag() {
  return getGlobalTag("channels");
}

export function getChannelIdTag(id: string) {
  return getIdTag("channels", id);
}

export function getChannelServerTag(placeId: string) {
  return getServerTag("channels", placeId);
}

export function revalidateChannelCache({
  channelId,
  serverId,
}: {
  channelId: string;
  serverId: string;
}) {
  revalidateTag(getChannelGlobalTag());
  revalidateTag(getChannelIdTag(channelId));
  revalidateTag(getChannelServerTag(serverId));
}
