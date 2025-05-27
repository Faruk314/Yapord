"use client";

import IncomingCall from "@/features/calls/component/modals/IncomingCall";
import { useCallStore } from "@/features/calls/store/call";
import { useCallEvents } from "@/features/calls/websocket/listeners/client/call";
import { useMediasoupEvents } from "@/features/calls/websocket/listeners/client/mediasoup";

export function GlobalSocketListener() {
  const callModalOpen = useCallStore((state) => state.callModalOpen);

  useCallEvents();

  useMediasoupEvents();

  return callModalOpen ? <IncomingCall /> : null;
}
