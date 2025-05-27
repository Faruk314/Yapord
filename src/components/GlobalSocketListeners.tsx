"use client";

import IncomingCall from "@/features/calls/component/modals/IncomingCall";
import { useCallStore } from "@/features/calls/store/call";
import { useCallEvents } from "@/features/calls/websocket/listeners/client/call";

export function GlobalSocketListener() {
  const callModalOpen = useCallStore((state) => state.callModalOpen);

  useCallEvents();

  return callModalOpen ? <IncomingCall /> : null;
}
