"use client";

import { useSocket } from "@/context/socketContext";

export function useCallEmiters() {
  const { socket } = useSocket();

  function emitUserCall(data: { channelId: string; recipientId: string }) {
    socket?.emit("callUser", data);
  }

  function emitCallDecline(data: { callerId: string }) {
    socket?.emit("callDecline", data);
  }

  function emitCallAccept(data: { channelId: string }) {
    socket?.emit("callAccept", data);
  }

  return {
    emitUserCall,
    emitCallDecline,
    emitCallAccept,
  };
}
