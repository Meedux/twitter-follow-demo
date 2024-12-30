import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import axios from 'axios';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { targetUserId, loggedInUserId } = await request.json();
    const apiKey = process.env.SOCIALDATA_API_KEY;
    const url = `https://api.socialdata.tools/twitter/user/${loggedInUserId}/following/${targetUserId}`;
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
    };

    try {
      const response = await axios.get(url, { headers });

      if (response.data.status === 'success' && response.data.is_following) {
        await User.create({
          twitterId: loggedInUserId,
          targetId: targetUserId,
          followStatus: true,
          timestamp: new Date()
        });

        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ error: 'Failed to verify follow status' }, { status: 400 });
      }
    } catch (error) {
      console.error('SocialData API Error:', error);
      return NextResponse.json({ error: 'SocialData API error' }, { status: 503 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}