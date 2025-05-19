import { ChannelType } from "@/drizzle/schema";
import { IserverMember } from "@/features/servers/types/servers";

interface Ichannel {
  id: string;
  name: string;
  type: ChannelType;
  members: string[];
}

interface IchannelMessage {
  id: string;
  createdAt: Date;
  content: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface IchannelRoom {
  id: string;
  users: IserverMember[];
}

export type { Ichannel, IchannelMessage, IchannelRoom };
