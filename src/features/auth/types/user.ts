interface Iuser {
  id: string;
  name: string;
  image: string | null;
}

interface IredisUser {
  id: string;
  name: string;
  image: string | null;
  channelId: string | null;
  socketId: string;
}

export type { Iuser, IredisUser };
