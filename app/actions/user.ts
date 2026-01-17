import { authSession } from "@/lib/server/auth-utils";
import db from "@/lib/db";
import { ensureFreeSubscription } from "@/lib/subscription";

export async function updateProfile() {
  const session = await authSession();
  if (!session) throw new Error("Unauthorized");

  await ensureFreeSubscription(session.user.id);

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      name: true,
      image: true,
      twoFactorEnabled: true,

      subscription: {
        select: {
          planTier: true,
          postLimit: true,
          postsUsed: true,
          status: true,
        },
      },

      twitterAccounts: {
        where: { isActive: true },
        select: {
          id: true,
          username: true,
          name: true,
          profileImageUrl: true,
        },
      },
    },
  });

  return user;
}

export async function getTwitterAccounts() {
  const session = await authSession();
  if (!session) throw new Error("Unauthorized");

  const accounts = await db.twitterAccount.findMany({
    where: {
      userId: session.user.id,
      isActive: true,
    },
    select: {
      id: true,
      username: true,
      name: true,
      profileImageUrl: true,
    },
  });

  return accounts ?? [];
}

