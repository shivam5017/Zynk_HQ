import { NextResponse } from "next/server";
import { authSession } from "@/lib/server/auth-utils";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await authSession();
    if (!session) {
      return NextResponse.json({ error: "not_logged_in" }, { status: 401 });
    }

    const { caption, scheduledTime, media = [] } = await req.json();
    const userId = session.user.id;

    if (!caption?.trim()) {
      return NextResponse.json({ error: "caption_required" }, { status: 400 });
    }

    if (!scheduledTime) {
      return NextResponse.json(
        { error: "schedule_time_required" },
        { status: 400 }
      );
    }

    const parsedTime = new Date(scheduledTime);
    if (isNaN(parsedTime.getTime())) {
      return NextResponse.json(
        { error: "invalid_schedule_time" },
        { status: 400 }
      );
    }

    const now = new Date();
    const oneMinuteFromNow = new Date(now.getTime() + 60_000);

    if (parsedTime <= oneMinuteFromNow) {
      return NextResponse.json(
        { error: "schedule_time_must_be_at_least_1_minute_in_future" },
        { status: 400 }
      );
    }

    const twitterAccount = await db.twitterAccount.findFirst({
      where: { userId, isActive: true },
    });

    if (!twitterAccount) {
      return NextResponse.json(
        { error: "no_twitter_account_connected" },
        { status: 400 }
      );
    }

    // ======================
    // ✅ CREATE SCHEDULED POST
    // ======================
    const scheduledPost = await db.scheduledPost.create({
      data: {
        userId,
        twitterAccountId: twitterAccount.id,
        content: caption,
        mediaUrls: media,
        scheduledTime: parsedTime,
        status: "SCHEDULED",
      },
    });

    // ======================
    // 🔥 UPDATE SUBSCRIPTION USAGE
    // ======================
    await db.subscription.update({
      where: { userId },
      data: {
        postsUsed: { increment: 1 },
      },
    });

    console.log("✅ Post scheduled & quota consumed", {
      postId: scheduledPost.id,
      scheduledUTC: parsedTime.toISOString(),
    });

    return NextResponse.json({
      success: true,
      scheduledPost: {
        id: scheduledPost.id,
        scheduledTime: scheduledPost.scheduledTime,
        content: scheduledPost.content,
        status: scheduledPost.status,
      },
    });
  } catch (err) {
    console.error("❌ Schedule error:", err);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}
