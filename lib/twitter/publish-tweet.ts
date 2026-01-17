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
    expiresAt: Date | null;
  };
}

/* ----------------------------------------
   TOKEN HANDLING (CRITICAL FIX)
---------------------------------------- */

async function getValidAccessToken(account: ScheduledPostWithAccount["twitterAccount"]) {
  // Token still valid → use it
  if (account.expiresAt && account.expiresAt > new Date()) {
    return account.accessToken;
  }

  console.log(`[${account.id}] Access token expired, refreshing...`);

  if (!account.refreshToken) {
    throw new Error("Missing refresh token");
  }

  const token = await refreshTwitterToken(account.refreshToken);

  await db.twitterAccount.update({
    where: { id: account.id },
    data: {
      accessToken: token.access_token,
      refreshToken: token.refresh_token, // 🔥 MUST SAVE
      expiresAt: new Date(Date.now() + token.expires_in * 1000),
    },
  });

  console.log(`[${account.id}] Token refreshed and saved`);

  return token.access_token;
}

/* ----------------------------------------
   MEDIA UPLOAD
---------------------------------------- */

async function uploadMedia(accessToken: string, base64: string) {
  const form = new FormData();
  form.append("media_data", base64);

  const res = await fetch(MEDIA_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: form,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("Media upload failed →", json);
    throw new Error("twitter_media_upload_failed");
  }

  return json.media_id_string as string;
}

/* ----------------------------------------
   TWEET PUBLISH
---------------------------------------- */

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

/* ----------------------------------------
   MAIN ENTRY
---------------------------------------- */

export async function publishScheduledPost(
  scheduledPost: ScheduledPostWithAccount
) {
  const { id, content, mediaUrls, twitterAccount } = scheduledPost;

  console.log(`[${id}] Starting scheduled publish`);

  // ✅ ALWAYS get valid token FIRST
  const accessToken = await getValidAccessToken(twitterAccount);

  /* ---------- Upload media ---------- */
  const mediaIds: string[] = [];

  if (mediaUrls?.length) {
    console.log(`[${id}] Uploading ${mediaUrls.length} media files`);

    for (const media of mediaUrls) {
      const mediaId = await uploadMedia(accessToken, media);
      mediaIds.push(mediaId);
    }
  }

  /* ---------- Publish tweet ---------- */
  console.log(`[${id}] Publishing tweet`);

  const { ok, json } = await publishTweet(accessToken, content, mediaIds);

  if (!ok) {
    console.error(`[${id}] Tweet publish failed`, json);

    await db.scheduledPost.update({
      where: { id },
      data: { status: "FAILED" },
    });

    throw new Error(`Tweet publish failed: ${JSON.stringify(json)}`);
  }

  const tweetId = json?.data?.id;

  /* ---------- Mark as published ---------- */
  await db.scheduledPost.update({
    where: { id },
    data: {
      status: "PUBLISHED",
      publishedTweetId: tweetId,
    },
  });

  console.log(`[${id}] Published successfully → Tweet ID: ${tweetId}`);

  return { tweetId };
}
