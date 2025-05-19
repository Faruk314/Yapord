import React from "react";
import { getServer } from "@/features/servers/db/servers";
import { ServerDropdownMenu } from "@/features/servers/components/ServerDropdownMenu";
import { redirect } from "next/navigation";
import { getCurrentServerMember } from "@/features/servers/actions/serverMembers";
import Channels from "@/features/channels/components/Channels";
import { getServerMembers } from "@/features/servers/db/serverMembers";

export default async function ServerLayout({
  params,
  children,
}: {
  params: Promise<{ serverId: string }>;
  children: React.ReactNode;
}) {
  const { serverId } = await params;

  const serverMember = await getCurrentServerMember();

  if (!serverMember) redirect("/home");

  const server = await getServer(serverId);

  const serverMembers = await getServerMembers(serverId);

  if (!server || !serverMembers) redirect("/home");

  return (
    <>
      <div className="border-r-2 border-gray-300 overflow-y-auto h-[100vh]">
        <div className="flex items-center justify-between lg:w-[20rem] h-18 px-4 border-b-2 border-gray-300">
          <span className="text-xl font-semibold">{server?.name}</span>

          <ServerDropdownMenu
            serverMemberRole={serverMember?.role}
            serverMembers={serverMembers}
            ownerId={serverMember.userId}
            server={server}
          />
        </div>

        <Channels serverId={serverId} userId={serverMember.userId} />
      </div>

      {children}
    </>
  );
}
