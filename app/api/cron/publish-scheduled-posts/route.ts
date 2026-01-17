import { NextResponse } from "next/server";
import db from "@/lib/db";
import { publishScheduledPost } from "@/lib/twitter/publish-tweet";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(req: Request) {
  try {
    /**
     * ✅ cron-job.org SAFE AUTH
     * Use query param instead of headers
     */
    console.log("🔐 CRON_SECRET ENV:", process.env.CRON_SECRET);

    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");

    if (secret !== process.env.CRON_SECRET) {
      console.error("❌ Unauthorized cron request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    console.log("🕐 Cron started at:", now.toISOString());

    const duePosts = await db.scheduledPost.findMany({
      where: {
        status: "SCHEDULED",
        scheduledTime: {
          lte: now,
        },
      },
      include: {
        twitterAccount: true,
      },
      orderBy: {
        scheduledTime: "asc",
      },
      take: 50,
    });

    console.log(`📋 Due posts found: ${duePosts.length}`);

    if (duePosts.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No posts due",
        processed: 0,
        timestamp: now.toISOString(),
      });
    }

    const results = {
      published: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const post of duePosts) {
      try {
        console.log(`📤 Publishing post ${post.id}`);
        console.log(`   Scheduled UTC: ${post.scheduledTime.toISOString()}`);
        console.log(`   Account: @${post.twitterAccount.username}`);

        /**
         * 🚀 Publish to Twitter
         */
        await publishScheduledPost(post);

        /**
         * ✅ THIS WAS THE MISSING PIECE
         */
        await db.scheduledPost.update({
          where: { id: post.id },
          data: {
            status: "PUBLISHED",
          },
        });

        results.published++;
        console.log(`✅ Post ${post.id} marked as PUBLISHED`);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";

        console.error(`❌ Failed post ${post.id}:`, message);

        results.failed++;
        results.errors.push(`Post ${post.id}: ${message}`);

        await db.scheduledPost.update({
          where: { id: post.id },
          data: {
            status: "FAILED",
          },
        });
      }
    }

    console.log("📊 Cron results:", results);

    return NextResponse.json({
      success: true,
      processed: duePosts.length,
      results,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("❌ Cron crashed:", error);
    return NextResponse.json(
      {
        error: "internal_server_error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
