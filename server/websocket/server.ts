import * as http from "http";
import { Server as ServerIO, Socket } from "socket.io";
import { db, eq, UserTable } from "@yapord/shared/drizzle";
import { getUserSessionById } from "@yapord/shared/redis/methods/session";
import { deleteUser, insertUser } from "@yapord/shared/redis/methods/user";
import MediasoupListeners from "./listeners/mediasoup";
import CallListeners from "./listeners/call";
import ChannelListeners from "./listeners/channel";
import { initMediasoupWorker } from "mediasoup/mediasoup";

function parseCookies(cookieHeader: string): Record<string, string> {
  return cookieHeader
    .split(";")
    .map((part) => part.trim().split("="))
    .reduce((acc, [key, value]) => {
      if (key && value !== undefined) acc[key] = decodeURIComponent(value);
      return acc;
    }, {} as Record<string, string>);
}

const httpServer = http.createServer();

const io = new ServerIO(httpServer, {
  path: "/ws",
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

async function main() {
  await initMediasoupWorker();

  io.use(async (socket: Socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;

      if (!cookieHeader) {
        return next(new Error("Missing cookie header"));
      }

      const cookies = parseCookies(cookieHeader);
      const sessionId = cookies["session-id"];

      if (!sessionId) {
        return next(new Error("Missing session-id cookie"));
      }

      const session = await getUserSessionById(sessionId);

      if (!session) {
        return next(new Error("Invalid session"));
      }

      const user = await db.query.UserTable.findFirst({
        columns: {
          id: true,
          name: true,
          image: true,
        },
        where: eq(UserTable.id, session.id),
      });

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = {
        id: user.id,
        name: user.name,
        image: user.image,
      };
      next();
    } catch (error) {
      console.error("Socket middleware error:", error);
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", async (socket: Socket) => {
    const user = socket.user;

    console.log(`User connected: ${user.id}`);

    await insertUser({
      id: user.id,
      socketId: socket.id,
      channelId: null,
    });

    socket.on("disconnect", async () => {
      await deleteUser(user.id);

      console.log("user discconected");
    });

    new ChannelListeners(io, socket).registerListeners();
    new CallListeners(io, socket).registerListeners();
    new MediasoupListeners(io, socket).registerListeners();
  });

  httpServer.listen(3001, () => {
    console.log("✅ Socket.IO server running on http://localhost:3001");
  });
}

main().catch((err) => {
  console.error("Fatal server error:", err);
  process.exit(1);
});
