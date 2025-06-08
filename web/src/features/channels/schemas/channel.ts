import { z } from "zod";
import { channelTypes } from "@shared/drizzle/schema";

export const channelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(channelTypes),
});
