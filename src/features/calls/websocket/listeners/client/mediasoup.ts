"use client";

import { useSocket } from "@/context/socketContext";
import { useSocketEvent } from "@/hooks/useSocketEvent";
import { useMediasoupHandlers } from "../../handlers/mediasoup";

export const useMediasoupEvents = () => {
  const { socket } = useSocket();
  const { onRtpCapabilities, onTransportCreated } = useMediasoupHandlers();

  useSocketEvent(socket, "rtpCapabilities", onRtpCapabilities);

  useSocketEvent(socket, "transportCreated", onTransportCreated);
};
