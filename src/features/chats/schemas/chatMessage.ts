import { z } from "zod";

export const chatMessageSchema = z.object({
  chatId: z.string().min(1),
  senderId: z.string().min(1),
  content: z.string().min(1),
});
