import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getTwitterClient } from '@/lib/twitter';

export async function POST(request: NextRequest) {
  await dbConnect();
  
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production'
    });
    console.log(token);
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!token.accessToken) {
      return NextResponse.json({ error: 'No access token' }, { status: 401 });
    }

    const twitter = getTwitterClient(token.accessToken as string);
    const targetUserId = process.env.TWITTER_USER_ID!;

    try {
      const follow = await twitter.v2.follow(token.sub!, targetUserId);
      
      if (follow.data.following) {
        await User.create({
          twitterId: token.sub,
          twitterHandle: token.username,
          targetId: targetUserId,
          followStatus: true,
          timestamp: new Date()
        });

        return NextResponse.json({ success: true });
      }
    } catch (twitterError) {
      console.error('Twitter API Error:', twitterError);
      return NextResponse.json({ error: 'Twitter API error' }, { status: 503 });
    }

    return NextResponse.json({ error: 'Follow failed' }, { status: 400 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}