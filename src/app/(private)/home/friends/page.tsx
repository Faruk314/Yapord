import { getCurrentUser } from "@/features/auth/actions/user";
import Friend from "@/features/friends/components/Friend";
import { getFriends } from "@/features/friends/db/friends";
import React from "react";

export default async function FriendsPage() {
  const user = await getCurrentUser({ redirectIfNotFound: true });

  const friends = await getFriends(user.id);

  return (
    <section className="p-4 flex flex-col space-y-4">
      <span className="text-2xl font-black">ALL FRIENDS</span>

      {friends.length > 0 ? (
        friends.map((friendReq) => (
          <Friend key={friendReq.id} user={friendReq} />
        ))
      ) : (
        <p>Friend list empty</p>
      )}
    </section>
  );
}
