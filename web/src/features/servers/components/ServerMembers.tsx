"use client";

import React from "react";
import Avatar from "@/components/ui/Avatar";
import { useServerStore } from "../store/server";

export default function ServerMembers() {
  const serverMembers = useServerStore((state) => state.serverMembers);
  return (
    <div className="grid gap-3 mt-10">
      {serverMembers.map((member) => (
        <div
          key={member.id}
          className="flex items-center space-x-3 hover:bg-gray-100 hover:rounded-md"
        >
          <Avatar name={member.name} className="w-10 h-10" />

          <div className="flex flex-col md:flex-row space-x-1 text-[0.9rem] text-gray-500">
            <span>{member.name}</span>
            <span>({member.role})</span>
          </div>
        </div>
      ))}
    </div>
  );
}
