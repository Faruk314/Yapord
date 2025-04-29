import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { UserTable } from "@/drizzle/schema";
import { generateSalt, hashPassword } from "../utils/auth";

async function getUser(id: string) {
  return db.query.UserTable.findFirst({
    columns: { id: true, email: true, role: true, name: true, image: true },
    where: eq(UserTable.id, id),
  });
}

async function insertUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const salt = await generateSalt();
  const hashedPassword = await hashPassword(data.password, salt);

  const [user] = await db
    .insert(UserTable)
    .values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      salt,
      image: "",
    })
    .returning({ id: UserTable.id, role: UserTable.role });

  if (user == null) throw new Error("Failed to create user");

  return user;
}

export { getUser, insertUser };
