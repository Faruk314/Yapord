"use client";

import { IconBtn } from "@/components/buttons/IconBtn";
import Avatar from "@/components/ui/Avatar";
import { useSocket } from "@/context/socketContext";
import { Iuser } from "@/features/auth/types/user";
import PrivateCall from "@/features/calls/component/modals/PrivateCall";
import { Phone, Video } from "lucide-react";
import { useChatCallStore } from "../store /ChatCalls";
import { useCallEmiters } from "@/features/calls/websocket/emiters/call";

interface Props {
  chatId: string;
  userInfo: Iuser;
  recipientInfo: Iuser;
}

export default function PrivateChatHeader({
  chatId,
  userInfo,
  recipientInfo,
}: Props) {
  const { socket } = useSocket();
  const { emitUserCall } = useCallEmiters();
  const callModalOpen = useChatCallStore((state) => state.callModalOpen);
  const openChatCallModal = useChatCallStore((state) => state.openCallModal);

  function handleCall() {
    if (!socket) return;

    emitUserCall({ channelId: chatId, recipientId: recipientInfo.id });

    openChatCallModal();
  }

  return (
    <div className="flex items-center justify-between h-18 px-4 border-b border-gray-300 relative">
      <div className="flex items-center space-x-4 ">
        <Avatar
          className="h-9 w-9"
          name={recipientInfo.name}
          imageSrc={recipientInfo.image}
        />
        <span className="text-xl font-semibold">{recipientInfo.name}</span>
      </div>

      <div className="flex items-center space-x-4">
        <IconBtn className="h-9 w-9" icon={<Phone />} />
        <IconBtn
          onClick={handleCall}
          className="h-9 w-9 cursor-pointer"
          icon={<Video />}
        />
      </div>

      {callModalOpen && (
        <PrivateCall
          userInfo={userInfo}
          recipientInfo={recipientInfo}
          type="video"
        />
      )}

      {callModalOpen && (
        <PrivateCall
          userInfo={userInfo}
          recipientInfo={recipientInfo}
          type="audio"
        />
      )}
    </div>
  );
}
