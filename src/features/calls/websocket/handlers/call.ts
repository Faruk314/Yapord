"use client";

import { Iuser } from "@/features/auth/types/user";
import { useCallStore } from "../../store/call";
import { useChatCallStore } from "@/features/chats/store /ChatCalls";

export function useCallHandlers() {
  const closeChatCallModal = useChatCallStore((state) => state.closeCallModal);
  const openCallModal = useCallStore((state) => state.openCallModal);
  const setIncomingCallInfo = useCallStore(
    (state) => state.setIncomingCallInfo
  );

  function onIncomingCall(data: { channelId: string; senderInfo: Iuser }) {
    setIncomingCallInfo(data);
    openCallModal();
  }

  function onCallDeclined() {
    closeChatCallModal();
  }

  function onCallAccepted() {}

  return {
    onIncomingCall,
    onCallDeclined,
    onCallAccepted,
  };
}
