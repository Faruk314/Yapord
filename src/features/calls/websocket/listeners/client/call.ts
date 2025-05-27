"use client";

import { useSocket } from "@/context/socketContext";
import { useSocketEvent } from "@/hooks/useSocketEvent";
import { useCallHandlers } from "../../handlers/call";

export const useCallEvents = () => {
  const { socket } = useSocket();
  const { onIncomingCall, onCallDeclined } = useCallHandlers();

  useSocketEvent(socket, "incomingCall", onIncomingCall);

  useSocketEvent(socket, "callDeclined", onCallDeclined);
};
