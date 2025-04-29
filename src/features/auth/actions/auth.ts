"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { signInSchema, signUpSchema } from "../schemas/auth";
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { createUserSession, removeUserFromSession } from "../db/session";
import { insertUser } from "../db/user";
import { comparePasswords } from "../utils/auth";

async function signUp(unsafeData: z.infer<typeof signUpSchema>) {
  const { success, data } = signUpSchema.safeParse(unsafeData);

  if (!success) return "Unable to create account";

  const existingUser = await db.query.UserTable.findFirst({
    where: eq(UserTable.email, data.email),
  });

  if (existingUser != null) return "Account already exists for this email";

  try {
    const user = await insertUser(data);

    await createUserSession(user);
  } catch {
    return "Unable to create account";
  }

  redirect("/private/home");
}

async function signIn(unsafeData: z.infer<typeof signInSchema>) {
  const { success, data } = signInSchema.safeParse(unsafeData);

  if (!success) return "Unable to log you in";

  const user = await db.query.UserTable.findFirst({
    columns: {
      password: true,
      salt: true,
      id: true,
      email: true,
      role: true,
      image: true,
    },
    where: eq(UserTable.email, data.email),
  });

  if (user == null) {
    return "Unable to log you in";
  }

  const isCorrectPassword = await comparePasswords({
    hashedPassword: user.password,
    password: data.password,
    salt: user.salt,
  });

  if (!isCorrectPassword) return "Unable to log you in";

  await createUserSession(user);

  redirect("/private/home");
}

async function logOut() {
  await removeUserFromSession();

  redirect("/signIn");
}

export { signIn, signUp, logOut };
