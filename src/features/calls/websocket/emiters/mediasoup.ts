import { useSocket } from "@/context/socketContext";
import { types } from "mediasoup-client";
import { Consumer } from "mediasoup-client/types";

export function useMediasoupEmiters() {
  const { socket } = useSocket();

  function emitGetRtpCapabilities(data: { channelId: string }) {
    socket?.emit("getRtpCapabilities", data);
  }

  function emitCreateTransport(data: { channelId: string }) {
    socket?.emit("createTransport", data);
  }

  function emitConnectSendTransport(
    data: {
      transportId: string;
      dtlsParameters: types.DtlsParameters;
    },
    onSuccess: () => void,
    onError: (error: Error) => void
  ) {
    socket?.emit(
      "connectSendTransport",
      data,
      (response: { error?: string }) => {
        if (response && response.error) {
          console.error(
            "Backend error connecting send transport:",
            response.error
          );
          onError(new Error(response.error));
        } else {
          console.log("Backend confirmed send transport connection.");
          onSuccess();
        }
      }
    );
  }

  function emitConnectRecvTransport(
    data: {
      transportId: string;
      dtlsParameters: types.DtlsParameters;
    },
    onSuccess: () => void,
    onError: (error: Error) => void
  ) {
    socket?.emit(
      "connectRecvTransport",
      data,
      (response: { error?: string }) => {
        if (response && response.error) {
          console.error(
            "Backend error connecting recv transport:",
            response.error
          );
          onError(new Error(response.error));
        } else {
          console.log("Backend confirmed recv transport connection.");
          onSuccess();
        }
      }
    );
  }

  function emitCreateProducer(
    data: {
      transportId: string;
      channelId: string;
      kind: types.MediaKind;
      rtpParameters: types.RtpParameters;
      appData?: types.AppData;
    },
    onSuccess: (producerInfo: { id: string }) => void,
    onError: (error: Error) => void
  ) {
    socket?.emit(
      "createProducer",
      data,
      (response: { id?: string; error?: string }) => {
        if (response && response.error) {
          console.error("Backend error creating producer:", response.error);
          onError(new Error(response.error));
        } else if (response && response.id) {
          console.log(
            "Backend confirmed producer created with ID:",
            response.id
          );
          onSuccess({ id: response.id });
        } else {
          console.error(
            "Backend sent an unexpected response for createProducer:",
            response
          );
          onError(
            new Error("Unexpected response from backend for producer creation")
          );
        }
      }
    );
  }

  function emitCreateConsumer(
    data: {
      recvTransportId: string;
      channelId: string;
      producerId: string;
      rtpCapabilities: types.RtpCapabilities;
    },
    onSuccess: (consumerInfo: Consumer) => void
  ) {
    socket?.emit(
      "createConsumer",
      data,
      (response: Consumer & { error?: string }) => {
        if (response && response.error) {
          console.error("Backend error creating consumer:", response.error);

          throw new Error(response.error);
        } else if (!response) {
          console.error("Backend returned empty response for createConsumer.");

          throw new Error("Empty response from backend");
        } else {
          console.log("Backend confirmed consumer created:", response.id);

          onSuccess(response);
        }
      }
    );
  }

  return {
    emitGetRtpCapabilities,
    emitCreateTransport,
    emitConnectSendTransport,
    emitConnectRecvTransport,
    emitCreateProducer,
    emitCreateConsumer,
  };
}
