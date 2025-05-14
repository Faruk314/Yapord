import { ChannelType } from "@/drizzle/schema";

interface Ichannel {
  id: string;
  name: string;
  type: ChannelType;
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

export type { Ichannel, IchannelMessage };
