import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  const code = searchParams.get('code');

  // Retrieve the stored codeVerifier and state
  const codeVerifier = (globalThis as any).codeVerifier;
  const storedState = (globalThis as any).oauthState;

  if (!codeVerifier || !state || !storedState || !code) {
    return NextResponse.json({ error: 'You denied the app or your session expired!' }, { status: 400 });
  }
  if (state !== storedState) {
    return NextResponse.json({ error: 'Stored tokens didn\'t match!' }, { status: 400 });
  }

  const client = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID!,
    clientSecret: process.env.TWITTER_CLIENT_SECRET!,
  });

  try {
    const { client: loggedClient, accessToken, refreshToken, expiresIn } = await client.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: process.env.CALLBACK_URL!,
    });

    (globalThis as any).accessToken = accessToken;
    (globalThis as any).refreshToken = refreshToken;
    (globalThis as any).loggedInUserId = (await loggedClient.v2.me()).data.id;

    return NextResponse.redirect('/');
  } catch (error) {
    return NextResponse.json({ error: 'Invalid verifier or access tokens!' }, { status: 403 });
  }
}