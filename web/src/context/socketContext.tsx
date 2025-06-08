"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket, io as clientIO } from "socket.io-client";

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
    const SERVER_URL = "http://localhost:3001";
    const SOCKET_PATH = "/ws";

    const socketInstance = clientIO(SERVER_URL, {
      path: SOCKET_PATH,
      withCredentials: true,
    });

    socketInstance.on("connect", () => setIsConnected(true));

    socketInstance.on("disconnect", () => setIsConnected(false));

    socketInstance.on("connect_error", (err) =>
      console.error("Connection Error:", err.message)
    );

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
