"use client";

import { PrimaryBtn } from "@/components/buttons/PrimaryBtn";
import { SecondaryBtn } from "@/components/buttons/SecondaryBtn";
import Avatar from "@/components/ui/Avatar";
import { Iuser } from "@/features/auth/types/user";
import React from "react";
import {
  acceptFriendRequest,
  rejectFriendRequest,
} from "../actions/friendRequests";
import { toast } from "sonner";

interface Props {
  user: Iuser;
}

export default function FriendRequest({ user }: Props) {
  async function handleAccept() {
    const response = await acceptFriendRequest(user.id);

    if (response.error) {
      toast.error(response.message);

      return;
    }

    toast.success(response.message);
  }

  async function handleReject() {
    const response = await rejectFriendRequest(user.id);

    if (response.error) {
      toast.error(response.message);

      return;
    }

    toast(response.message);
  }

  return (
    <div className="flex justify-between font-semibold max-w-[40rem] border border-gray-300 p-2 rounded-md">
      <div className="flex space-x-2 items-center">
        <Avatar name={user.name} imageSrc={user.image} />

        <span>{user.name}</span>
      </div>

      <div className="flex items-center rounded-md space-x-2">
        <PrimaryBtn onClick={handleAccept}>Accept</PrimaryBtn>
        <SecondaryBtn onClick={handleReject}>Reject</SecondaryBtn>
      </div>
    </div>
  );
}
