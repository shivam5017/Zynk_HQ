"use server";

import db from "@/lib/db";
import { authSession } from "@/lib/server/auth-utils";

export async function getDraftPosts() {
  const session = await authSession();
  if (!session) return [];

  return db.scheduledPost.findMany({
    where: {
      userId: session.user.id,
      status: "DRAFT",
    },
    orderBy: { updatedAt: "desc" },
    include: {
      twitterAccount: {
        select: {
          username: true,
          name: true,
          profileImageUrl: true,
        },
      },
    },
  });
}
export async function getScheduledPosts() {
  const session = await authSession();
  if (!session) return [];

  return db.scheduledPost.findMany({
    where: {
      userId: session.user.id,
      status: "SCHEDULED",
    },
    orderBy: { updatedAt: "desc" },
    include: {
      twitterAccount: {
        select: {
          username: true,
          name: true,
          profileImageUrl: true,
        },
      },
    },
  });
}

