"use client";

import DialogWrapper from "@/components/DialogWrapper";
import { IconBtn } from "@/components/ui/IconBtn";
import React, { useState } from "react";
import { BiEdit } from "react-icons/bi";
import EditUserForm from "../EditUserForm";
import { z } from "zod";
import { userSchema } from "../../schemas/user";

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
      <IconBtn
        onClick={() => setIsOpen(true)}
        className="h-10 w-10"
        icon={<BiEdit />}
      />
    </>
  );
}
