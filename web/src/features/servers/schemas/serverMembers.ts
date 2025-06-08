import { serverRoles } from "@shared/drizzle/schema/serverMember";
import { z } from "zod";

export const serverMemberSchema = z.object({
  userId: z.string().uuid(),
  serverId: z.string().uuid(),
  role: z.enum(serverRoles).default("member"),
});
