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
          onError(new Error(response.error));
        } else {
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
          onError(new Error(response.error));
        } else {
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
          onError(new Error(response.error));
        } else if (response && response.id) {
          onSuccess({ id: response.id });
        } else {
          onError(
            new Error("Unexpected response from backend for producer creation")
          );
        }
      }
    );
  }

  function emitRemoveProducer(
    data: { producerId: string },
    onSuccess: () => void
  ) {
    socket?.emit(
      "removeProducer",
      data,
      (response: { error: boolean; message?: string }) => {
        if (response.error) {
          throw new Error(response.message);
        } else {
          console.log("hej from success");
          onSuccess();
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
          throw new Error(response.error);
        } else if (!response) {
          throw new Error("Empty response from backend");
        } else {
          onSuccess(response);
        }
      }
    );
  }

  function emitProducerPause(data: { producerId: string }) {
    socket?.emit(
      "producerPause",
      data,
      (response: { error: boolean; message?: string }) => {
        if (response.error) {
          throw new Error(response.message);
        }
      }
    );
  }

  function emitProducerResume(data: { producerId: string }) {
    socket?.emit(
      "producerResume",
      data,
      (response: { error: boolean; message?: string }) => {
        if (response.error) {
          throw new Error(response.message);
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
    emitRemoveProducer,
    emitCreateConsumer,
    emitProducerPause,
    emitProducerResume,
  };
}
