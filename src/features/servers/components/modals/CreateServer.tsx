"use client";

import React, { useState } from "react";
import DialogWrapper from "@/components/DialogWrapper";
import ServerForm from "../ServerForm";
import { IconBtn } from "@/components/ui/IconBtn";
import { PiPlusCircleBold } from "react-icons/pi";

interface Props {
  userId: string;
}

export default function CreateServer({ userId }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DialogWrapper
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Create Server"
        description="Give your new server a name. You can change it later if you want."
      >
        <ServerForm userId={userId} setIsOpen={setIsOpen} />
      </DialogWrapper>

      <IconBtn onClick={() => setIsOpen(true)} icon={<PiPlusCircleBold />} />
    </>
  );
}
