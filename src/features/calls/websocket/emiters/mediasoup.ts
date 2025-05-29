import { useSocket } from "@/context/socketContext";

export function useMediasoupEmiters() {
  const { socket } = useSocket();

  function emitGetRtpCapabilities(data: { channelId: string }) {
    socket?.emit("getRtpCapabilities", data);
  }

  function emitCreateTransport(data: { channelId: string }) {
    socket?.emit("createTransport", data);
  }

  return { emitGetRtpCapabilities, emitCreateTransport };
}
