"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Socket, io as clientIO } from "socket.io-client";
import { env } from "@/data/env/client";

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
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = clientIO(env.NEXT_PUBLIC_SITE_URL, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      withCredentials: true,
    });

    socketInstance.on("connect", () => setIsConnected(true));
    socketInstance.on("disconnect", () => setIsConnected(false));
    socketInstance.on("connect_error", (err) =>
      console.error("Connection Error:", err.message)
    );

    socketRef.current = socketInstance;

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <socketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </socketContext.Provider>
  );
}
