import React from "react";
import { getServer } from "@/features/servers/db/servers";
import { ServerDropdownMenu } from "@/features/servers/components/ServerDropdownMenu";
import { redirect } from "next/navigation";
import { getCurrentServerMember } from "@/features/servers/actions/serverMembers";
import Channels from "@/features/channels/components/Channels";

export default async function ServerLayout({
  params,
  children,
}: {
  params: Promise<{ serverId: string }>;
  children: React.ReactNode;
}) {
  const { serverId } = await params;

  const server = await getServer(serverId);

  const serverMember = await getCurrentServerMember();

  if (!server || !serverMember) redirect("/home");

  return (
    <>
      <div className="border-r-2 border-gray-300 overflow-y-auto h-[100vh]">
        <div className="flex items-center justify-between lg:w-[20rem] h-18 px-4 border-b-2 border-gray-300">
          <span className="text-xl font-semibold">{server?.name}</span>

          <ServerDropdownMenu
            serverMemberRole={serverMember?.role}
            ownerId={serverMember.userId}
            server={server}
          />
        </div>

        <Channels serverId={serverId} />
      </div>

      {children}
    </>
  );
}
