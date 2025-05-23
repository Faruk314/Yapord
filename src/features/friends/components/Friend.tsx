"use client";

import { IconBtn } from "@/components/buttons/IconBtn";
import Avatar from "@/components/ui/Avatar";
import { Iuser } from "@/features/auth/types/user";
import { initializeChat } from "@/features/chats/actions/chats";
import { MessageCircle, MoreVertical } from "lucide-react";

import React from "react";

interface Props {
  user: Iuser;
}

export default function Friend({ user }: Props) {
  async function handleMessageClick() {
    await initializeChat(user.id);
  }

  return (
    <div className="flex justify-between border-b font-semibold max-w-[40rem] p-2 hover:bg-gray-100 duration-200 hover:rounded-md">
      <div className="flex space-x-2 items-center">
        <Avatar name={user.name} imageSrc={user.image} />

        <span>{user.name}</span>
      </div>

      <div className="flex items-center rounded-md space-x-2">
        <IconBtn
          onClick={handleMessageClick}
          icon={<MessageCircle />}
          className="h-10 w-10"
        />
        <IconBtn icon={<MoreVertical />} className="h-10 w-10" />
      </div>
    </div>
  );
}
