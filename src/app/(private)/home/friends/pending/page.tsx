import { getCurrentUser } from "@/features/auth/actions/user";
import FriendRequest from "@/features/friends/components/FriendRequest";
import { getFriendRequests } from "@/features/friends/db/friendRequests";
import React from "react";

export default async function FriendRequestsPage() {
  const user = await getCurrentUser({ redirectIfNotFound: true });

  const friendRequests = await getFriendRequests(user.id);

  return (
    <section className="p-4 flex flex-col space-y-10">
      <span className="text-2xl font-black">PENDING REQUESTS</span>

      {friendRequests.length > 0 ? (
        friendRequests.map((friendReq) => (
          <FriendRequest key={friendReq.id} user={friendReq} />
        ))
      ) : (
        <p>You dont have any friend requests</p>
      )}
    </section>
  );
}
