import { getCurrentUser } from "@/features/auth/actions/user";
import ChannelChat from "@/features/channels/components/ChannelChat";
import { getChannel } from "@/features/channels/db/channels";
import React from "react";

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  const user = await getCurrentUser({
    redirectIfNotFound: true,
    withFullUser: true,
  });

  const { channelId } = await params;

  const channel = await getChannel(channelId);

  if (!channel) return;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between h-18 px-4 border-b-2 border-gray-300">
        <span className="text-xl font-semibold">{channel.name}</span>
      </div>

      <ChannelChat
        user={{ id: user.id, name: user.name, image: user.image }}
        channel={channel}
      />
    </div>
  );
}
