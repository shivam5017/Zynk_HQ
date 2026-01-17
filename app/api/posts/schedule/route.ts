import { NextResponse } from "next/server";
import { authSession } from "@/lib/server/auth-utils";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await authSession();
    if (!session)
      return NextResponse.json({ error: "not_logged_in" }, { status: 401 });

    const { caption, scheduledTime, media = [] } = await req.json();
    const userId = session.user.id;

    if (!caption?.trim())
      return NextResponse.json({ error: "caption_required" }, { status: 400 });

    if (!scheduledTime)
      return NextResponse.json(
        { error: "schedule_time_required" },
        { status: 400 }
      );

    const parsedTime = new Date(scheduledTime);
    if (isNaN(parsedTime.getTime()))
      return NextResponse.json(
        { error: "invalid_schedule_time" },
        { status: 400 }
      );

    // Check if schedule time is in the past
    if (parsedTime <= new Date()) {
      return NextResponse.json(
        { error: "schedule_time_must_be_in_future" },
        { status: 400 }
      );
    }

    const twitterAccount = await db.twitterAccount.findFirst({
      where: { userId, isActive: true },
    });

    if (!twitterAccount)
      return NextResponse.json(
        { error: "no_twitter_account_connected" },
        { status: 400 }
      );

    // Create scheduled post in database
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

    console.log("Post scheduled:", {
      postId: scheduledPost.id,
      scheduledTime: parsedTime.toISOString(),
    });

    return NextResponse.json({ 
      success: true, 
      scheduledPost: {
        id: scheduledPost.id,
        scheduledTime: scheduledPost.scheduledTime,
        content: scheduledPost.content,
      }
    });
  } catch (err) {
    console.error("schedule error:", err);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}