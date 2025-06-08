import { ServerRole } from "@/drizzle/schema";

interface Server {
  id: string;
  name: string;
  image: string | null;
  ownerId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IserverMember {
  id: string;
  name: string;
  image: string | null;
  role: ServerRole;
}

export type { Server, IserverMember };
