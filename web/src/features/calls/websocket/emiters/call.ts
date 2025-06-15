"use client";

import { useSocket } from "@/context/socketContext";
import { TCall } from "../../types/call";

export function useCallEmiters() {
  const { socket } = useSocket();

  function emitUserCall(data: {
    channelId: string;
    recipientId: string;
    callType: TCall;
  }) {
    socket?.emit("callUser", data);
  }

  function emitCallDecline(data: { channelId: string; callerId: string }) {
    socket?.emit("callDecline", data);
  }

  function emitCallAccept(data: { channelId: string }) {
    socket?.emit("callAccept", data);
  }

  function emitCallLeave() {
    socket?.emit("callLeave");
  }

  return {
    emitUserCall,
    emitCallDecline,
    emitCallAccept,
    emitCallLeave,
  };
}
