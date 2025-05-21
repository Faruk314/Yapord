import FriendForm from "@/features/friends/components/FriendForm";
import React from "react";

export default function AddFriendsPage() {
  return (
    <section className="flex flex-col space-y-4 p-4">
      <div>
        <span className="text-2xl font-black">ADD FRIEND</span>

        <p>You can add friends with their yapord username</p>
      </div>

      <FriendForm />
    </section>
  );
}
