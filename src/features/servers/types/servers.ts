interface Server {
  id: string;
  name: string;
  image: string | null;
  ownerId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type { Server };
