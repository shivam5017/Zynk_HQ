import { NextResponse } from "next/server";
import { authSession } from "@/lib/server/auth-utils";
import db from "@/lib/db";
import { refreshTwitterToken } from "@/lib/twitter/twitter-api";

const TWEET_URL = "https://api.twitter.com/2/tweets";
const MEDIA_URL = "https://upload.twitter.com/1.1/media/upload.json";

/**
 * Uploads media to Twitter
 */
async function uploadMedia(accessToken: string, base64: string) {
  const form = new FormData();
  form.append("media_data", base64);

  const uploadRes = await fetch(MEDIA_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: form,
  });

  const uploadJson = await uploadRes.json();

  if (!uploadRes.ok) {
    console.error("Media upload failed:", uploadJson);
    throw new Error("twitter_media_upload_failed");
  }

  return uploadJson.media_id_string;
}

/**
 * Publishes a tweet (with optional media)
 */
async function publishTweet(
  accessToken: string,
  caption: string,
  mediaIds: string[]
) {
  const payload: any = { text: caption };

  if (mediaIds.length > 0) {
    payload.media = { media_ids: mediaIds };
  }

  const res = await fetch(TWEET_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  return { ok: res.ok, json };
}

export async function POST(req: Request) {
  try {
    const session = await authSession();
    if (!session) {
      return NextResponse.json({ error: "not_logged_in" }, { status: 401 });
    }

    const { caption, media } = await req.json();
    const userId = session.user.id;

    if (!caption || caption.trim() === "") {
      return NextResponse.json({ error: "caption_required" }, { status: 400 });
    }

    // Get Active Twitter Account
    let twitterAccount = await db.twitterAccount.findFirst({
      where: { userId, isActive: true },
    });

    if (!twitterAccount) {
      return NextResponse.json(
        { error: "no_twitter_account_connected" },
        { status: 400 }
      );
    }

    let accessToken = twitterAccount.accessToken;

    // ================
    // 🔥 Upload Media
    // ================
    let mediaIds: string[] = [];

    if (media && Array.isArray(media)) {
      for (const m of media) {
        const mediaId = await uploadMedia(accessToken, m);
        mediaIds.push(mediaId);
      }
    }

    // ========================
    // 🔥 Publish Tweet
    // ========================
    let { ok, json } = await publishTweet(accessToken, caption, mediaIds);

    // If token expired → refresh tokens → retry publish
    if (!ok && json?.title === "Unauthorized") {
      if (twitterAccount.refreshToken) {
        const newTokens = await refreshTwitterToken(
          twitterAccount.refreshToken
        );

        await db.twitterAccount.update({
          where: { id: twitterAccount.id },
          data: {
            accessToken: newTokens.access_token,
            refreshToken:
              newTokens.refresh_token ?? twitterAccount.refreshToken,
            expiresAt: new Date(Date.now() + newTokens.expires_in * 1000),
          },
        });

        accessToken = newTokens.access_token;

        // retry publish
        const retry = await publishTweet(accessToken, caption, mediaIds);
        ok = retry.ok;
        json = retry.json;
      }
    }

    if (!ok) {
      console.log("Tweet publish failed:", json);
      return NextResponse.json(
        { error: "twitter_publish_failed", details: json },
        { status: 500 }
      );
    }

    const tweetId = json?.data?.id;

    // Save post to DB
    await db.scheduledPost.create({
      data: {
        twitterAccountId: twitterAccount.id,
        userId,
        content: caption,
        mediaUrls: [],
        scheduledTime: new Date(),
        status: "PUBLISHED",
        publishedTweetId: tweetId,
      },
    });
    await db.subscription.update({
      where: { userId },
      data: {
        postsUsed: { increment: 1 },
      },
    });

    return NextResponse.json({ success: true, tweetId });
  } catch (error) {
    console.error("/api/posts/publish error:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}
