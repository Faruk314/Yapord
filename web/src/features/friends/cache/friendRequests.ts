import { getUserTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getFriendRequestUserTag(userId: string) {
  return getUserTag("friendRequests", userId);
}

export function revalidateFriendRequestsCache({ userId }: { userId: string }) {
  revalidateTag(getFriendRequestUserTag(userId));
}
