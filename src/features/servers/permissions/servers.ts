import { ServerRole } from "@/drizzle/schema";

function canUpdateServers(user: { role: ServerRole } | null) {
  return user?.role === "admin" || user?.role === "owner";
}

function canDeleteServers(user: { role: ServerRole } | null) {
  return user?.role === "owner";
}

export { canUpdateServers, canDeleteServers };
