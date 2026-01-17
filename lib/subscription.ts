
"use server";

import db from "@/lib/db";
import { PLAN_LIMITS } from "./plan-limits";

export async function ensureFreeSubscription(userId: string) {
  const existing = await db.subscription.findUnique({
    where: { userId },
  });

  if (existing) return existing;

  return db.subscription.create({
    data: {
      userId,
      stripeCustomerId: `free_${userId}`,
      planTier: "FREE",
      status: "ACTIVE",
      postLimit: PLAN_LIMITS.FREE.postLimit,
      postsUsed: 0,
    },
  });
}

