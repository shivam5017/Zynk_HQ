import { NextResponse } from "next/server";
import db from "@/lib/db";
import { publishScheduledPost } from "@/lib/twitter/publish-tweet";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes max execution

export async function GET(req: Request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    // Get all posts that should be published (scheduledTime <= now and status = SCHEDULED)
    const duePosts = await db.scheduledPost.findMany({
      where: {
        scheduledTime: {
          lte: now,
        },
        status: "SCHEDULED",
      },
      include: {
        twitterAccount: true,
      },
      take: 50, // Process max 50 posts per run
      orderBy: {
        scheduledTime: "asc",
      },
    });

    if (duePosts.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No posts to publish",
        processed: 0,
      });
    }

    console.log(`📋 Found ${duePosts.length} posts to publish`);

    const results = {
      success: 0,
      failed: 0,
    };

    for (const post of duePosts) {
      try {
        console.log(`📤 Publishing post ${post.id}...`);
        await publishScheduledPost(post);
        results.success++;
        console.log(`✅ Post ${post.id} published successfully`);
      } catch (error) {
        console.error(`❌ Error publishing post ${post.id}:`, error);
        results.failed++;
        
    
        await db.scheduledPost.update({
          where: { id: post.id },
          data: { status: "FAILED" },
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: duePosts.length,
      results,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}