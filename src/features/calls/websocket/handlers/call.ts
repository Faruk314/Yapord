"use client";

import { Iuser } from "@/features/auth/types/user";
import { useCallStore } from "../../store/call";
import { useChatCallStore } from "@/features/chats/store /ChatCalls";
import { useMediasoupEmiters } from "../emiters/mediasoup";
import { useCallback } from "react";

export function useCallHandlers() {
  const { emitGetRtpCapabilities } = useMediasoupEmiters();
  const closeChatCallModal = useChatCallStore((state) => state.closeCallModal);
  const openCallModal = useCallStore((state) => state.openCallModal);
  const setIncomingCallInfo = useCallStore(
    (state) => state.setIncomingCallInfo
  );

  const onIncomingCall = useCallback(
    (data: { channelId: string; senderInfo: Iuser }) => {
      setIncomingCallInfo(data);
      openCallModal();
    },
    [setIncomingCallInfo, openCallModal]
  );

  const onCallDeclined = useCallback(() => {
    closeChatCallModal();
  }, [closeChatCallModal]);

  const onCallAccepted = useCallback(
    (data: { channelId: string }) => {
      emitGetRtpCapabilities(data);
    },
    [emitGetRtpCapabilities]
  );

  return {
    onIncomingCall,
    onCallDeclined,
    onCallAccepted,
  };
}
