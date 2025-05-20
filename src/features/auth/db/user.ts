import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { UserTable } from "@/drizzle/schema";
import { generateSalt, hashPassword } from "../utils/auth";
import { getUserIdTag, revalidateUserCache } from "../cache/user";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

async function getUser(id: string) {
  "use cache";
  cacheTag(getUserIdTag(id));

  return db.query.UserTable.findFirst({
    columns: { id: true, email: true, role: true, name: true, image: true },
    where: eq(UserTable.id, id),
  });
}

async function getUserByName(name: string) {
  return db.query.UserTable.findFirst({
    columns: { id: true },
    where: eq(UserTable.name, name),
  });
}

async function insertUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const salt = await generateSalt();
  const hashedPassword = await hashPassword(data.password, salt);

  const [newUser] = await db
    .insert(UserTable)
    .values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      salt,
      image: "",
    })
    .returning({ id: UserTable.id, role: UserTable.role });

  if (newUser == null) throw new Error("Failed to create user");

  revalidateUserCache(newUser.id);

  return newUser;
}

async function updateUser(
  userId: string,
  data: Partial<typeof UserTable.$inferInsert>,
  trx: Omit<typeof db, "$client">
) {
  const [updatedUser] = await trx
    .update(UserTable)
    .set({
      ...data,
      image: data.image ?? UserTable.image,
    })
    .where(eq(UserTable.id, userId))
    .returning();

  if (updatedUser == null) throw new Error("Failed to update user");

  revalidateUserCache(updatedUser.id);

  return updatedUser;
}

export { getUser, getUserByName, insertUser, updateUser };
