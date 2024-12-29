import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { TwitterApi } from 'twitter-api-v2';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { targetUserId, loggedInUserId } = await request.json();
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accessToken = authorization.split(' ')[1];
    const client = new TwitterApi(accessToken);
    const twitter = client.v2;

    try {
      const follow = await twitter.follow(loggedInUserId, targetUserId);

      if (follow.data.following) {
        await User.create({
          twitterId: loggedInUserId,
          targetId: targetUserId,
          followStatus: true,
          timestamp: new Date()
        });

        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ error: 'Failed to follow user' }, { status: 400 });
      }
    } catch (twitterError) {
      console.error('Twitter API Error:', twitterError);
      return NextResponse.json({ error: 'Twitter API error' }, { status: 503 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}