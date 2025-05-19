import React from "react";
import { Dropdown } from "@/components/dropdowns/Dropdown";
import CreateChannel from "./modals/CreateChannel";
import Channel from "./Channel";
import { getChannels } from "../db/channels";

export default async function Channels({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}) {
  const channels = await getChannels(serverId);

  return (
    <>
      <div className="p-4 flex items-start">
        <Dropdown label="Text channel">
          <div className="pt-4">
            <div className="flex flex-col space-y-1">
              {channels
                .filter((c) => c.type === "text")
                .map((channel) => (
                  <Channel
                    userId={userId}
                    serverId={serverId}
                    key={channel.id}
                    channel={channel}
                  />
                ))}
            </div>
          </div>
        </Dropdown>

        <CreateChannel serverId={serverId} channelType="text" />
      </div>

      <div className="px-4 pb-4 flex items-start">
        <Dropdown label="Voice channel">
          <div className="flex flex-col space-y-1 pt-4">
            {channels
              .filter((c) => c.type === "voice")
              .map((channel) => (
                <Channel
                  serverId={serverId}
                  userId={userId}
                  key={channel.id}
                  channel={channel}
                />
              ))}
          </div>
        </Dropdown>

        <CreateChannel serverId={serverId} channelType="voice" />
      </div>
    </>
  );
}
