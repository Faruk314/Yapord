import { ServerRole } from "@/drizzle/schema";

function canCreateChannels(user: { role: ServerRole } | null) {
  return user?.role === "admin" || user?.role === "owner";
}

export { canCreateChannels };
