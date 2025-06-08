import { useSocket } from "@/context/socketContext";
import { useSocketEvent } from "@/hooks/useSocketEvent";

export const useChannelEvents = () => {
  const { socket } = useSocket();

  function onChannelMessage() {}

  useSocketEvent(socket, "channel:message", onChannelMessage);
};
