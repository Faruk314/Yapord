"use client";

import Avatar from "@/components/ui/Avatar";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { HiOutlineSpeakerWave, HiMiniHashtag } from "react-icons/hi2";
import { Ichannel } from "../types/channel";
import { joinChannel } from "../actions/channels";
import { toast } from "sonner";
import { useChannelMembersStore } from "../store/channelMembers";
import { useServerStore } from "@/features/servers/store/server";

interface Props {
  serverId: string;
  channel: Ichannel;
  userId: string;
}

export default function Channel({ serverId, channel, userId }: Props) {
  const router = useRouter();
  const {
    channelMembersMap,
    setChannelMembers,
    removeChannelMember,
    addChannelMember,
  } = useChannelMembersStore();
  const { getServerMember } = useServerStore();

  useEffect(() => {
    setChannelMembers(channel.id, channel.members);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleChannelJoin() {
    const response = await joinChannel(channel.id);

    if (response.error) {
      toast.error(response.message);
      return;
    }

    removeChannelMember(response.data!.previousChannelId!, userId);

    addChannelMember(channel.id, userId);

    router.push(`/server/${serverId}/${channel.id}`);
  }

  return (
    <div className="w-full">
      <button
        onClick={handleChannelJoin}
        key={channel.id}
        className="flex space-x-2 items-center text-gray-500 py-1 hover:bg-gray-100 hover:rounded-md cursor-pointer w-full  "
      >
        {channel.type === "voice" ? (
          <HiOutlineSpeakerWave />
        ) : (
          <HiMiniHashtag />
        )}
        <span>{channel.name}</span>
      </button>

      <div className="flex flex-col">
        {channelMembersMap[channel.id]?.map((memberId) => {
          const member = getServerMember(memberId);

          return (
            <div
              key={member?.id}
              className="flex items-center space-x-2 py-1 hover:bg-gray-100 hover:rounded-md"
            >
              <Avatar className="h-[1.6rem] w-[1.6rem]" name={member?.name} />
              <span className="text-sm text-gray-900 font-semibold tracking-wide">
                {member?.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
