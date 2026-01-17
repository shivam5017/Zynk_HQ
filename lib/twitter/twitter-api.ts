
interface TwitterTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface TwitterProfile {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
}

const TOKEN_URL = "https://api.twitter.com/2/oauth2/token";
const PROFILE_URL = "https://api.twitter.com/2/users/me";


export async function exchangeCodeForToken(
  code: string,
  verifier: string
) {
  const credentials = Buffer.from(
    `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.TWITTER_REDIRECT_URI!,
      code_verifier: verifier,
    }).toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return res.json();
}


/**
 * Get logged-in Twitter user profile
 */
export async function getTwitterProfile(
  accessToken: string
): Promise<TwitterProfile> {
  const res = await fetch(`${PROFILE_URL}?user.fields=profile_image_url`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Twitter profile fetch failed: ${error}`);
  }

  const json = await res.json();
  return json.data;
}

/**
 * Refresh an expired access token
 */
export async function refreshTwitterToken(refreshToken: string) {
  const clientId = process.env.TWITTER_CLIENT_ID!;
  const clientSecret = process.env.TWITTER_CLIENT_SECRET!;

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const params = new URLSearchParams();
  params.append("refresh_token", refreshToken);
  params.append("grant_type", "refresh_token");

  const res = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Twitter token refresh failed: ${error}`);
  }

  return res.json();
}


