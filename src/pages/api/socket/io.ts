import { Server as ServerIO, Socket } from "socket.io";
import { NextApiResponseServerIO } from "@/types/next";
import { NextApiRequest } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

function ioHandler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";

    const httpServer = res.socket.server;

    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });

    // io.use(async (socket: Socket, next) => {
    //   const cookieHeader = socket.request.headers.cookie;
    // });

    io.on("connection", (socket) => {
      console.log("Connected:", socket.id);
    });

    res.socket.server.io = io;
  }

  res.end();
}

export default ioHandler;
