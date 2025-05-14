import { Server as ServerIO, Socket } from "socket.io";
import { NextApiResponseServerIO } from "@/types/next";
import { NextApiRequest } from "next";
import { getUserSessionById } from "@/features/auth/db/session";
import ChannelListeners from "@/features/channels/webSocket/listeners/server/channel";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { UserTable } from "@/drizzle/schema";

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
      cors: {
        origin: "http://localhost:3000",
        credentials: true,
      },
    });

    io.use(async (socket: Socket, next) => {
      const cookieHeader = socket.request.headers.cookie;

      if (!cookieHeader) {
        return next(new Error("Cookies authentication error"));
      }

      const cookies = Object.fromEntries(
        cookieHeader.split("; ").map((c) => c.split("="))
      );

      const sessionId = cookies["session-id"];

      if (!sessionId) {
        return next(new Error("Cookies authentication error"));
      }

      const session = await getUserSessionById(sessionId);

      if (!session) {
        return next(new Error("Session authentication error"));
      }

      try {
        const user = await db.query.UserTable.findFirst({
          columns: {
            id: true,
            name: true,
            image: true,
          },
          where: eq(UserTable.id, session.id),
        });

        if (!user)
          return next(new Error("Could not get user in socket io middleware"));

        socket.user = { id: user.id, name: user.name, image: user.image };

        next();
      } catch (err) {
        console.error("Error fetching user in socket middleware:", err);
        return next(new Error("Error fetching user data"));
      }
    });

    io.on("connection", (socket) => {
      const channelListeners = new ChannelListeners(io, socket);

      channelListeners.registerListeners();
    });

    res.socket.server.io = io;
  }

  res.end();
}

export default ioHandler;
