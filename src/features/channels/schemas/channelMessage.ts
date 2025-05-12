import { z } from "zod";

export const channelMessageSchema = z.object({
  content: z.string().min(1, "Message content is required"),
  senderId: z.string().uuid("Sender ID must be a valid UUID"),
  channelId: z.string().uuid("Channel ID must be a valid UUID"),
});
