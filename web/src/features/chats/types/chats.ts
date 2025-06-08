import { ChatType } from "@shared/drizzle/schema";

interface Ichat {
  name: string | null;
  id: string;
  type: ChatType;
  createdAt: Date;
  updatedAt: Date;
  chatKey: string | null;
}

export type { Ichat };
