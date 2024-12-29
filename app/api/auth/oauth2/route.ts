import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID!,
  clientSecret: process.env.TWITTER_CLIENT_SECRET!,
});

export async function GET() {
  const { url, codeVerifier, state } = client.generateOAuth2AuthLink(process.env.CALLBACK_URL!, {
    scope: ['tweet.read', 'users.read', 'follows.write', 'offline.access'],
  });

  (globalThis as any).oauthState = state;
  (globalThis as any).codeVerifier = codeVerifier;

  return NextResponse.redirect(url);
}