import { getCurrentUser } from "@/features/auth/actions/user";
import React from "react";

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  await getCurrentUser({ redirectIfNotFound: true });

  const { channelId } = await params;

  console.log(channelId);

  return (
    <div className="">
      <div className="flex items-center justify-between lg:w-[20rem] h-18 px-4 border-b-2 border-gray-300 w-full">
        <span className="text-xl font-semibold"></span>
      </div>
    </div>
  );
}
