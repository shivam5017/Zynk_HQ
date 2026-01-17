
import db from "@/lib/db";
import { PlanTier } from "@/lib/generated/prisma/client";
import { authSession } from "../server/auth-utils";

// Define plan limits
export const PLAN_LIMITS: Record<PlanTier, { twitterAccounts: number; postsPerMonth: number }> = {
  FREE: { twitterAccounts: 1, postsPerMonth: 10 },
  GROWTH: { twitterAccounts: 3, postsPerMonth: 100 },
  PREMIUM: { twitterAccounts: 10, postsPerMonth: 1000 },
};

export async function canConnectTwitter(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      subscription: { select: { planTier: true } },
      twitterAccounts: {
        where: { isActive: true },
        select: { id: true },
      },
    },
  });

  if (!user || !user.subscription) return false;

  const limit = PLAN_LIMITS[user.subscription.planTier].twitterAccounts;
  return user.twitterAccounts.length < limit;
}

export async function getTwitterAccountLimit(userId: string): Promise<{ current: number; limit: number }> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      subscription: { select: { planTier: true } },
      twitterAccounts: {
        where: { isActive: true },
        select: { id: true },
      },
    },
  });

  if (!user || !user.subscription) {
    return { current: 0, limit: 0 };
  }

  const limit = PLAN_LIMITS[user.subscription.planTier].twitterAccounts;
  return { current: user.twitterAccounts.length, limit };
}



