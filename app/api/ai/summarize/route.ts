import { NextRequest, NextResponse } from 'next/server';
import { summarizePostForHistory } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, platform } = body as {
      content: string;
      platform: string;
    };

    if (!content || !platform) {
      return NextResponse.json({ error: 'Content and platform are required' }, { status: 400 });
    }

    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'DeepSeek API key not configured' },
        { status: 500 }
      );
    }

    const summary = await summarizePostForHistory(content, platform);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error summarizing post:', error);
    return NextResponse.json(
      { error: 'Failed to summarize post' },
      { status: 500 }
    );
  }
}
