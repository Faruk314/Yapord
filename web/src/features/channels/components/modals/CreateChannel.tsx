"use client";

import React, { useState } from "react";
import DialogWrapper from "@/components/modals/DialogWrapper";
import ChannelForm from "../ChannelForm";
import { ChannelType } from "@shared/drizzle/schema";
import { Plus } from "lucide-react";

interface Props {
  serverId: string;
  channelType: ChannelType;
}

export default function CreateChannel({ serverId, channelType }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DialogWrapper
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Create channel"
        description={`In ${channelType} channels`}
      >
        <ChannelForm
          channelType={channelType}
          serverId={serverId}
          setIsOpen={setIsOpen}
        />
      </DialogWrapper>

      <button onClick={() => setIsOpen(true)} className="cursor-pointer">
        <Plus size={20} />
      </button>
    </>
  );
}
