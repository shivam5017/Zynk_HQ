import db from "@/lib/db";
import { refreshTwitterToken } from "./twitter-api";

const TWEET_URL = "https://api.twitter.com/2/tweets";
const MEDIA_URL = "https://upload.twitter.com/1.1/media/upload.json";

interface ScheduledPostWithAccount {
  id: string;
  content: string;
  mediaUrls: string[];
  twitterAccount: {
    id: string;
    accessToken: string;
    refreshToken: string | null;
    expiresAt: Date | null; // Changed from Date to Date | null
  };
}

// Upload media
async function uploadMedia(accessToken: string, base64: string) {
  const form = new FormData();
  form.append("media_data", base64);

  const res = await fetch(MEDIA_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: form,
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    console.error("Media upload failed →", json);
    throw new Error("twitter_media_upload_failed");
  }

  const json = await res.json();
  return json.media_id_string;
}

// Publish tweet
async function publishTweet(
  accessToken: string,
  caption: string,
  mediaIds: string[]
) {
  const payload: any = { text: caption };
  if (mediaIds.length) payload.media = { media_ids: mediaIds };

  const res = await fetch(TWEET_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, json };
}

export async function publishScheduledPost(
  scheduledPost: ScheduledPostWithAccount
) {
  const { id, content, mediaUrls, twitterAccount } = scheduledPost;
  let accessToken = twitterAccount.accessToken;

  // Upload media if any
  const mediaIds: string[] = [];
  for (const m of mediaUrls) {
    mediaIds.push(await uploadMedia(accessToken, m));
  }

  // Attempt to publish
  let { ok, json } = await publishTweet(accessToken, content, mediaIds);

  // Refresh token if unauthorized
  if (!ok && json?.title === "Unauthorized") {
    console.log("Token expired, refreshing...");
    
    if (!twitterAccount.refreshToken) {
      throw new Error("No refresh token available");
    }

    const newTokens = await refreshTwitterToken(twitterAccount.refreshToken);

    await db.twitterAccount.update({
      where: { id: twitterAccount.id },
      data: {
        accessToken: newTokens.access_token,
        refreshToken: newTokens.refresh_token ?? twitterAccount.refreshToken,
        expiresAt: new Date(Date.now() + newTokens.expires_in * 1000),
      },
    });

    accessToken = newTokens.access_token;
    const retry = await publishTweet(accessToken, content, mediaIds);
    ok = retry.ok;
    json = retry.json;
  }

  if (!ok) {
    console.error("Tweet publish failed →", json);
    await db.scheduledPost.update({
      where: { id },
      data: { status: "FAILED" },
    });
    throw new Error(`Failed to publish tweet: ${JSON.stringify(json)}`);
  }

  const tweetId = json?.data?.id;
  await db.scheduledPost.update({
    where: { id },
    data: { 
      status: "PUBLISHED", 
      publishedTweetId: tweetId,
      // Remove publishedAt if it doesn't exist in your schema
    },
  });

  return { tweetId };
}