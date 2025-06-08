// import * as http from "http";
// import { Server as ServerIO, Socket } from "socket.io";
// import { getUserSessionById } from "../src/features/auth/db/session";
// import ChannelListeners from "../src/features/channels/webSocket/listeners/server/channel";
// import { db } from "../src/drizzle/db";
// import { eq } from "drizzle-orm";
// import { UserTable } from "../src/drizzle/schema/user";
// import { deleteUser, insertUser } from "../src/features/auth/db/redis/user";
// import CallListeners from "../src/features/calls/websocket/listeners/server/call";
// import { initMediasoupWorker } from "../src/mediasoup/mediasoup";
// import MediasoupListeners from "../src/features/calls/websocket/listeners/server/mediasoup";

// function parseCookies(cookieHeader: string): Record<string, string> {
//   return cookieHeader
//     .split(";")
//     .map((part) => part.trim().split("="))
//     .reduce((acc, [key, value]) => {
//       if (key && value !== undefined) acc[key] = decodeURIComponent(value);
//       return acc;
//     }, {} as Record<string, string>);
// }

// const httpServer = http.createServer();

// const io = new ServerIO(httpServer, {
//   path: "/ws",
//   cors: {
//     origin: "http://localhost:3000",
//     credentials: true,
//   },
// });

// async function main() {
//   await initMediasoupWorker();

//   io.use(async (socket: Socket, next) => {
//     try {
//       const cookieHeader = socket.handshake.headers.cookie;

//       if (!cookieHeader) {
//         return next(new Error("Missing cookie header"));
//       }

//       const cookies = parseCookies(cookieHeader);
//       const sessionId = cookies["session-id"];

//       if (!sessionId) {
//         return next(new Error("Missing session-id cookie"));
//       }

//       const session = await getUserSessionById(sessionId);

//       if (!session) {
//         return next(new Error("Invalid session"));
//       }

//       const user = await db.query.UserTable.findFirst({
//         columns: {
//           id: true,
//           name: true,
//           image: true,
//         },
//         where: eq(UserTable.id, session.id),
//       });

//       if (!user) {
//         return next(new Error("User not found"));
//       }

//       socket.user = {
//         id: user.id,
//         name: user.name,
//         image: user.image,
//       };
//       next();
//     } catch (error) {
//       console.error("Socket middleware error:", error);
//       next(new Error("Authentication failed"));
//     }
//   });

//   io.on("connection", async (socket: Socket) => {
//     const user = socket.user;

//     console.log(`User connected: ${user.id}`);

//     await insertUser({
//       id: user.id,
//       socketId: socket.id,
//       channelId: null,
//     });

//     socket.on("disconnect", async () => {
//       await deleteUser(user.id);
//     });

//     new ChannelListeners(io, socket).registerListeners();
//     new CallListeners(io, socket).registerListeners();
//     new MediasoupListeners(io, socket).registerListeners();
//   });

//   httpServer.listen(3001, () => {
//     console.log("✅ Socket.IO server running on http://localhost:3001");
//   });
// }

// main().catch((err) => {
//   console.error("Fatal server error:", err);
//   process.exit(1);
// });

import * as http from "http";
import { Server as SocketIOServer } from "socket.io";
import { sayHello } from "./methods";

// Create a simple HTTP server (no request handling needed here)
const httpServer = http.createServer();

// Create a Socket.IO server attached to the HTTP server
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*", // allow all origins for testing
  },
});

// Handle connections
io.on("connection", (socket) => {
  console.log("Client connected, socket id:", socket.id);

  // Listen for a test event from the client
  socket.on("hello", (msg) => {
    console.log("Received message:", msg);
    // Reply back to the client
    socket.emit("helloResponse", "Hello from server!");
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start the server on port 3001
httpServer.listen(3001, () => {
  console.log("Server listening on http://localhost:3001");
  console.log(sayHello());
});
