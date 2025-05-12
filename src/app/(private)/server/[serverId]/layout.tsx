import React from "react";
import { HiMiniHashtag, HiOutlineSpeakerWave } from "react-icons/hi2";
import { Dropdown } from "@/components/dropdowns/Dropdown";
import { getServer } from "@/features/servers/db/servers";
import { ServerDropdownMenu } from "@/features/servers/components/ServerDropdownMenu";
import { getCurrentUser } from "@/features/auth/actions/user";
import { redirect } from "next/navigation";
import { getCurrentServerMember } from "@/features/servers/actions/serverMembers";
import CreateChannel from "@/features/channels/components/modals/CreateChannel";
import Link from "next/link";

export default async function ServerLayout({
  params,
  children,
}: {
  params: Promise<{ serverId: string }>;
  children: React.ReactNode;
}) {
  const user = await getCurrentUser({ redirectIfNotFound: true });

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
            ownerId={user.id}
            server={server}
          />
        </div>

        <div className="p-4 flex items-start">
          <Dropdown label="Text channel">
            <div className="pt-4">
              <div className="flex flex-col space-y-1">
                {server.channels
                  .filter((c) => c.type === "text")
                  .map((channel) => (
                    <Link
                      href={`/server/${server.id}/${channel.id}`}
                      key={channel.id}
                      className="flex space-x-2 items-center text-gray-500 py-1 hover:bg-gray-100 hover:rounded-md cursor-pointer"
                    >
                      <HiMiniHashtag />
                      <span>{channel.name}</span>
                    </Link>
                  ))}
              </div>
            </div>
          </Dropdown>

          <CreateChannel serverId={serverId} channelType="text" />
        </div>

        <div className="px-4 pb-4 flex items-start">
          <Dropdown label="Voice channel">
            <div className="flex flex-col space-y-1 pt-4">
              {server.channels
                .filter((c) => c.type === "voice")
                .map((channel) => (
                  <Link
                    href={`/server/${server.id}/${channel.id}`}
                    key={channel.id}
                    className="flex space-x-2 items-center text-gray-500 py-1 hover:bg-gray-100 hover:rounded-md cursor-pointer"
                  >
                    <HiOutlineSpeakerWave />
                    <span>{channel.name}</span>
                  </Link>
                ))}
            </div>
          </Dropdown>

          <CreateChannel serverId={serverId} channelType="voice" />
        </div>
      </div>

      {children}
    </>
  );
}
