"use client";

import React from "react";
import Avatar from "@/components/ui/Avatar";

export default function ServerMembers() {
  const serverMembers: number[] = [1, 2, 3, 4, 6];
  return (
    <div className="grid gap-3 mt-10">
      {serverMembers.map((member) => (
        <div
          key={member}
          className="flex items-center space-x-3 hover:bg-gray-100 hover:rounded-md"
        >
          <Avatar name="faruk" className="w-10 h-10" />

          <div className="flex flex-col md:flex-row space-x-1 text-[0.9rem] text-gray-500">
            <span>Faruk Spahic</span>
            <span>(Admin)</span>
          </div>
        </div>
      ))}
    </div>
  );
}
