import { NextRequest, NextResponse } from 'next/server';
import { generatePost } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, platforms, includeContext, includeHistory } = body as {
      prompt: string;
      platforms?: string[];
      includeContext?: boolean;
      includeHistory?: boolean;
    };

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'DeepSeek API key not configured' },
        { status: 500 }
      );
    }

    const content = await generatePost(prompt, {
      platforms,
      includeContext,
      includeHistory,
    });

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error generating post:', error);
    return NextResponse.json(
      { error: 'Failed to generate post' },
      { status: 500 }
    );
  }
}
