import React from "react";
import { HiMiniHashtag, HiOutlineSpeakerWave } from "react-icons/hi2";
import { Dropdown } from "@/components/ui/Dropdown";
import { getServer } from "@/features/servers/db/servers";
import { DropdownWrapper } from "@/components/ui/DropdownWrapper";
import { ServerDropdownMenu } from "@/features/servers/components/ServerDropdownMenu";
import { getCurrentUser } from "@/features/auth/actions/user";
import { redirect } from "next/navigation";
import { getCurrentServerMember } from "@/features/servers/actions/serverMembers";

export default async function ServerPage({
  params,
}: {
  params: Promise<{ serverId: string }>;
}) {
  const user = await getCurrentUser({ redirectIfNotFound: true });

  const { serverId } = await params;

  const server = await getServer(serverId);

  const serverMember = await getCurrentServerMember();

  if (!server || !serverMember) redirect("/private/home");

  return (
    <>
      <div className="border-r-2 border-gray-300 overflow-y-auto h-[100vh]">
        <div className="flex items-center justify-between lg:w-[20rem] py-4 px-4 border-b-2 border-gray-300">
          <span className="text-xl font-semibold">{server?.name}</span>
          <DropdownWrapper>
            <ServerDropdownMenu
              serverMemberRole={serverMember?.role}
              ownerId={user.id}
              server={server}
            />
          </DropdownWrapper>
        </div>

        <div className="p-4">
          <Dropdown label="Text channel">
            <div className="pt-4">
              <div className="flex flex-col space-y-1">
                {[0, 1].map((textChannel) => (
                  <div
                    key={textChannel}
                    className="flex space-x-2 items-center text-gray-500 py-1 hover:bg-gray-100 hover:rounded-md cursor-pointer"
                  >
                    <HiMiniHashtag />
                    <span>Text room</span>
                  </div>
                ))}
              </div>
            </div>
          </Dropdown>
        </div>

        <div className="px-4 pb-4">
          <Dropdown label="Voice channel">
            <div className="flex flex-col space-y-1 pt-4">
              {[0, 1].map((voiceChannel) => (
                <div
                  key={voiceChannel}
                  className="flex space-x-2 items-center text-gray-500 py-1 hover:bg-gray-100 hover:rounded-md cursor-pointer"
                >
                  <HiOutlineSpeakerWave />
                  <span>Voice Room</span>
                </div>
              ))}
            </div>
          </Dropdown>
        </div>
      </div>
    </>
  );
}
