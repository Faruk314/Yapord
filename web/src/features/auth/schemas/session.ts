import { userRoles } from "@shared/drizzle/schema";
import { z } from "zod";

export const sessionSchema = z.object({
  id: z.string(),
  role: z.enum(userRoles),
});
