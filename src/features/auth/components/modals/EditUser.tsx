"use client";

import DialogWrapper from "@/components/modals/DialogWrapper";
import { IconBtn } from "@/components/buttons/IconBtn";
import React, { useState } from "react";
import { BiEdit } from "react-icons/bi";
import EditUserForm from "../EditUserForm";
import { z } from "zod";
import { userSchema } from "../../schemas/user";
import Avatar from "@/components/ui/Avatar";

export default function EditUser({
  user,
  userId,
}: {
  user: z.infer<typeof userSchema>;
  userId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <DialogWrapper
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Edit profile"
        description="Make changes to your profile here. Click save when youre done."
      >
        <EditUserForm userId={userId} user={user} />
      </DialogWrapper>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 font-semibold cursor-pointer"
      >
        <Avatar name={user.name} />
        <span>{user.name}</span>
      </button>
    </>
  );
}
