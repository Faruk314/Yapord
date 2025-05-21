import { z } from "zod";

export const friendRequestSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(32, { message: "Name must be at most 32 characters long" }),
});
