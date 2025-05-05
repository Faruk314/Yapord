import Avatar from "@/components/ui/Avatar";
import Link from "next/link";
import React from "react";
import { getServers } from "../db/servers";

export default async function ServerList({ userId }: { userId: string }) {
  const servers = await getServers(userId);

  return (
    <>
      {servers.map((server) => (
        <Link
          key={server.id}
          href={`/private/home/${server.id}`}
          className="cursor-pointer"
        >
          <Avatar
            imageSrc={server.image}
            name={!server.image ? server.name : undefined}
          />
        </Link>
      ))}
    </>
  );
}
