import { NextResponse } from "next/server";
import { authSession } from "@/lib/server/auth-utils";
import db from "@/lib/db";

/* =======================
   CREATE DRAFT
======================= */
export async function POST(req: Request) {
  try {
    const session = await authSession();
    if (!session) {
      return NextResponse.json({ error: "not_logged_in" }, { status: 401 });
    }

    const { caption, media = [] } = await req.json();

    if (!caption || !caption.trim()) {
      return NextResponse.json(
        { error: "caption_required" },
        { status: 400 }
      );
    }

    // Active Twitter account
    const twitterAccount = await db.twitterAccount.findFirst({
      where: {
        userId: session.user.id,
        isActive: true,
      },
    });

    if (!twitterAccount) {
      return NextResponse.json(
        { error: "no_twitter_account_connected" },
        { status: 400 }
      );
    }

    const draft = await db.scheduledPost.create({
      data: {
        userId: session.user.id,
        twitterAccountId: twitterAccount.id,
        content: caption,
        mediaUrls: media,
        scheduledTime: new Date(),
        status: "DRAFT",
      },
    });

    return NextResponse.json({
      success: true,
      draftId: draft.id,
    });
  } catch (error) {
    console.error("/api/posts/draft POST error:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}

/* =======================
   GET DRAFTS
======================= */
export async function GET() {
  try {
    const session = await authSession();
    if (!session) {
      return NextResponse.json({ error: "not_logged_in" }, { status: 401 });
    }

    const drafts = await db.scheduledPost.findMany({
      where: {
        userId: session.user.id,
        status: "DRAFT",
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        twitterAccount: {
          select: {
            username: true,
            profileImageUrl: true,
          },
        },
      },
    });

    // ✅ IMPORTANT: serialize dates for client safety
    const safeDrafts = drafts.map((draft) => ({
      id: draft.id,
      content: draft.content,
      updatedAt: draft.updatedAt.toISOString(),
      twitterAccount: draft.twitterAccount,
    }));

    return NextResponse.json({ drafts: safeDrafts });
  } catch (error) {
    console.error("/api/posts/draft GET error:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}
