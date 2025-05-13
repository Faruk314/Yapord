"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket, io as clientIO } from "socket.io-client";
import { env } from "@/data/env/client";
import path from "path";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const socketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function useSocket() {
  return useContext(socketContext);
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance: Socket = clientIO(env.NEXT_PUBLIC_SITE_URL, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <socketContext.Provider value={{ socket, isConnected }}>
      {children}
    </socketContext.Provider>
  );
}
