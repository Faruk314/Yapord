import { getIdTag, getUserTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getFriendUserTag(userId: string) {
  return getUserTag("friends", userId);
}

export function getFriendIdTag(id: string) {
  return getIdTag("friends", id);
}

export function revalidateFriendCache({ userId }: { userId: string }) {
  revalidateTag(getFriendUserTag(userId));
}
