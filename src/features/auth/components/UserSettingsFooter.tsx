import React from "react";
import EditUser from "./modals/EditUser";
import { Iuser } from "../types/user";
import { Headphones, Mic, Settings } from "lucide-react";
import { IconBtn } from "@/components/buttons/IconBtn";

interface Props {
  user: Iuser;
}

export default function UserSettingsFooter({ user }: Props) {
  return (
    <div className="fixed z-20 bottom-4 left-4 bg-white flex items-center justify-between w-[23rem] p-2 rounded-md shadow-xl border border-gray-300">
      <EditUser user={user} userId={user.id} />

      <div className="flex space-x-2">
        <IconBtn className="h-10 w-10" icon={<Mic />} />
        <IconBtn className="h-10 w-10" icon={<Headphones />} />
        <IconBtn className="h-10 w-10" icon={<Settings />} />
      </div>
    </div>
  );
}
