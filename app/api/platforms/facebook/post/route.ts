import { NextRequest, NextResponse } from 'next/server';
import { getPlatform } from '@/lib/platforms';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body as { content: string };

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const platform = getPlatform('facebook');
    if (!platform) {
      return NextResponse.json({ error: 'Platform not found' }, { status: 404 });
    }

    const isAuth = await platform.isAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Not authenticated with Facebook' }, { status: 401 });
    }

    const result = await platform.post(content);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error posting to Facebook:', error);
    return NextResponse.json({ error: 'Failed to post to Facebook' }, { status: 500 });
  }
}
