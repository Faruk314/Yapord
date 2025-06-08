import { useEffect } from "react";
import { Socket } from "socket.io-client";

export const useSocketEvent = (
  socket: Socket | null,
  event: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (...args: any[]) => void
) => {
  useEffect(() => {
    if (socket) {
      socket.on(event, handler);

      return () => {
        socket.off(event, handler);
      };
    }
  }, [socket, event, handler]);
};
