import { getChannelTag, getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getChannelMessagesGlobalTag() {
  return getGlobalTag("channelMessages");
}

export function getChannelMessagesIdTag(messageId: string) {
  return getIdTag("channelMessages", messageId);
}

export function getChannelMessagesChannelTag(channelId: string) {
  return getChannelTag("channelMessages", channelId);
}

export function revalidateChannelMessageCache({
  messageId,
  channelId,
}: {
  messageId: string;
  channelId: string;
}) {
  revalidateTag(getChannelMessagesGlobalTag());
  revalidateTag(getChannelMessagesIdTag(messageId));
  revalidateTag(getChannelMessagesChannelTag(channelId));
}
