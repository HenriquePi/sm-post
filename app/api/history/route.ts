import { NextRequest, NextResponse } from 'next/server';
import { getPostHistory, createPostHistoryEntry } from '@/lib/data';
import type { PostStatus } from '@/lib/types';

export async function GET() {
  try {
    const entries = await getPostHistory();
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching post history:', error);
    return NextResponse.json({ error: 'Failed to fetch post history' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, abbreviatedContent, fullContent, postedAt, status } = body as {
      platform: string;
      abbreviatedContent: string;
      fullContent: string;
      postedAt: string;
      status: PostStatus;
    };

    if (!platform || !abbreviatedContent || !fullContent || !postedAt || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const entry = await createPostHistoryEntry({
      platform,
      abbreviatedContent,
      fullContent,
      postedAt,
      status,
    });
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('Error creating post history entry:', error);
    return NextResponse.json({ error: 'Failed to create post history entry' }, { status: 500 });
  }
}
