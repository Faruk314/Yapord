"use client";

import React from "react";
import { useCallStore } from "../../store/call";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import Avatar from "@/components/ui/Avatar";
import { IconBtn } from "@/components/buttons/IconBtn";
import { PhoneCall, PhoneOff } from "lucide-react";
import { useSocket } from "@/context/socketContext";
import { useRouter } from "next/navigation";
import { useChatCallStore } from "@/features/chats/store /ChatCalls";
import { useCallEmiters } from "../../websocket/emiters/call";

export default function IncomingCall() {
  const { channelId, senderInfo } = useCallStore(
    (state) => state.incomingCallInfo!
  );

  const closeIncomingCallModal = useCallStore((state) => state.closeCallModal);
  const incomingCallModalOpen = useCallStore((state) => state.callModalOpen);
  const openChatCallModal = useChatCallStore((state) => state.openCallModal);
  const { emitCallDecline } = useCallEmiters();
  const { socket } = useSocket();
  const router = useRouter();

  const handleAccept = () => {
    router.push(`/home/chat/${channelId}`);

    closeIncomingCallModal();

    openChatCallModal();
  };

  const handleDecline = () => {
    if (!socket || !senderInfo.id) return;

    emitCallDecline({ callerId: senderInfo.id });

    closeIncomingCallModal();
  };

  return (
    <Dialog open={incomingCallModalOpen}>
      <DialogContent className="sm:max-w-[20rem] py-20 flex flex-col items-center text-center space-y-4 [&>button]:hidden">
        <div className="flex justify-center">
          <Avatar
            className="h-35 w-35 text-6xl"
            imageSrc={senderInfo.image}
            name={senderInfo.name}
          />
        </div>

        <DialogHeader>
          <DialogTitle className="flex space-x-1">
            <span>Incoming call from</span>
            <span className="font-semibold">{senderInfo.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4">
          <IconBtn
            className="bg-red-500 hover:bg-red-400"
            icon={<PhoneOff />}
            onClick={handleDecline}
          >
            Decline
          </IconBtn>
          <IconBtn
            icon={<PhoneCall />}
            className="bg-green-600 hover:bg-green-500"
            onClick={handleAccept}
          >
            Accept
          </IconBtn>
        </div>
      </DialogContent>
    </Dialog>
  );
}
