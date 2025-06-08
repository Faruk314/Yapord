import { db } from "@/drizzle/db";
import {
  OAuthProvider,
  UserOAuthAccountTable,
  UserTable,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm";

async function connectUserToAccount(
  { id, email, name }: { id: string; email: string; name: string },
  provider: OAuthProvider
) {
  return db.transaction(async (trx) => {
    let user = await trx.query.UserTable.findFirst({
      where: eq(UserTable.email, email),
      columns: { id: true, role: true },
    });

    if (user == null) {
      const [newUser] = await trx
        .insert(UserTable)
        .values({
          email: email,
          name: name,
        })
        .returning({ id: UserTable.id, role: UserTable.role });
      user = newUser;
    }

    await trx
      .insert(UserOAuthAccountTable)
      .values({
        provider,
        providerAccountId: id,
        userId: user.id,
      })
      .onConflictDoNothing();

    return user;
  });
}

export { connectUserToAccount };
