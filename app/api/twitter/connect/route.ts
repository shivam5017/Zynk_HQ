// app/api/twitter/connect/route.ts
import { NextResponse } from "next/server";
import { authSession } from "@/lib/server/auth-utils";
import { canConnectTwitter } from "@/lib/twitter/twitter-helper";
import { generatePKCE } from "@/lib/twitter/twitter-pkce";
import { generateTwitterAuthUrl } from "@/lib/twitter/twitter-oauth";
import crypto from "crypto";
import db from "@/lib/db";

export async function GET() {
  try {
    const session = await authSession();
    if (!session) {
      return NextResponse.json({ error: "not_logged_in" }, { status: 401 });
    }

    const allowed = await canConnectTwitter(session.user.id);
    if (!allowed) {
      return NextResponse.json({ error: "twitter_limit" }, { status: 403 });
    }

    const { verifier, challenge } = generatePKCE();
    const state = crypto.randomBytes(16).toString("hex");

    await db.twitterOAuthState.create({
      data: {
        state,
        verifier,
        userId: session.user.id,
      },
    });

    const url = generateTwitterAuthUrl(challenge, state);

    return NextResponse.json({ url });
  } catch (err) {
    console.error("Twitter connect error:", err);
    return NextResponse.json(
      { error: "twitter_connect_failed" },
      { status: 500 }
    );
  }
}
