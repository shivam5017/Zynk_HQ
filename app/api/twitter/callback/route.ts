import { NextResponse } from "next/server";
import { authSession } from "@/lib/server/auth-utils";
import {
  exchangeCodeForToken,
  getTwitterProfile,
} from "@/lib/twitter/twitter-api";
import db from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await authSession();
    if (!session) {
      return NextResponse.redirect(
        new URL("/sign-in", process.env.NEXT_PUBLIC_APP_URL!)
      );
    }

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    console.log("📥 Callback Code:", code?.substring(0, 12) + "...");
    console.log("📥 State Returned:", state);

    if (error) {
      return NextResponse.redirect(
        new URL(
          `/dashboard/settings?error=twitter_${error}`,
          process.env.NEXT_PUBLIC_APP_URL!
        )
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL(
          "/dashboard/settings?error=twitter_no_code",
          process.env.NEXT_PUBLIC_APP_URL!
        )
      );
    }

    // --- VALIDATE STATE ---
    const savedState = await db.twitterOAuthState.findUnique({
      where: { state },
    });

    if (!savedState) {
      console.error("❌ Invalid or expired state");
      return NextResponse.redirect(
        new URL(
          "/dashboard/settings?error=invalid_state",
          process.env.NEXT_PUBLIC_APP_URL!
        )
      );
    }

    if (savedState.userId !== session.user.id) {
      console.error("❌ User mismatch");
      return NextResponse.redirect(
        new URL(
          "/dashboard/settings?error=user_mismatch",
          process.env.NEXT_PUBLIC_APP_URL!
        )
      );
    }

    // Once used — remove it
   

    // Exchange code for token
    const token = await exchangeCodeForToken(code, savedState.verifier);
    console.log("✅ Token exchange success");

     await db.twitterOAuthState.delete({
      where: { state },
    });
    // Get user profile
    const profile = await getTwitterProfile(token.access_token);
    console.log("🐦 Twitter User:", profile.username);

    // Check existing accounts
    const existingAccount = await db.twitterAccount.findFirst({
      where: {
        userId: session.user.id,
        twitterUserId: profile.id,
      },
    });

    if (existingAccount) {
      await db.twitterAccount.update({
        where: { id: existingAccount.id },
        data: {
          username: profile.username,
          name: profile.name,
          profileImageUrl: profile.profile_image_url,
          accessToken: token.access_token,
          refreshToken: token.refresh_token,
          expiresAt: token.expires_in
            ? new Date(Date.now() + token.expires_in * 1000)
            : null,
          isActive: true,
          updatedAt: new Date(),
        },
      });
    } else {
      const conflict = await db.twitterAccount.findUnique({
        where: { twitterUserId: profile.id },
      });

      if (conflict) {
        return NextResponse.redirect(
          new URL(
            "/dashboard/settings?error=twitter_already_connected",
            process.env.NEXT_PUBLIC_APP_URL!
          )
        );
      }

      await db.twitterAccount.create({
        data: {
          userId: session.user.id,
          twitterUserId: profile.id,
          username: profile.username,
          name: profile.name,
          profileImageUrl: profile.profile_image_url,
          accessToken: token.access_token,
          refreshToken: token.refresh_token,
          expiresAt: token.expires_in
            ? new Date(Date.now() + token.expires_in * 1000)
            : null,
        },
      });
    }

    return NextResponse.redirect(
      new URL(
        "/update-profile?success=twitter_connected",
        process.env.NEXT_PUBLIC_APP_URL!
      )
    );
  } catch (err) {
    console.error("❌ Twitter Callback Error:", err);
    return NextResponse.redirect(
      new URL(
        "/dashboard/settings?error=twitter_callback",
        process.env.NEXT_PUBLIC_APP_URL!
      )
    );
  }
}
