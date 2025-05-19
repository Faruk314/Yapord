"use client";

import DialogWrapper from "@/components/modals/DialogWrapper";
import React, { useState } from "react";
import EditUserForm from "../EditUserForm";
import Avatar from "@/components/ui/Avatar";
import { Iuser } from "../../types/user";

export default function EditUser({
  user,
  userId,
}: {
  user: Iuser;
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
        <Avatar name={user.name} imageSrc={user.image} />
        <span>{user.name}</span>
      </button>
    </>
  );
}
