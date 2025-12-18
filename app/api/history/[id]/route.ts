import { NextRequest, NextResponse } from 'next/server';
import { getPostHistoryEntry, updatePostHistoryEntry, deletePostHistoryEntry } from '@/lib/data';
import type { PostStatus } from '@/lib/types';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const entry = await getPostHistoryEntry(id);
    if (!entry) {
      return NextResponse.json({ error: 'Post history entry not found' }, { status: 404 });
    }
    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error fetching post history entry:', error);
    return NextResponse.json({ error: 'Failed to fetch post history entry' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { platform, abbreviatedContent, fullContent, postedAt, status } = body as {
      platform?: string;
      abbreviatedContent?: string;
      fullContent?: string;
      postedAt?: string;
      status?: PostStatus;
    };

    const entry = await updatePostHistoryEntry(id, {
      platform,
      abbreviatedContent,
      fullContent,
      postedAt,
      status,
    });
    if (!entry) {
      return NextResponse.json({ error: 'Post history entry not found' }, { status: 404 });
    }
    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error updating post history entry:', error);
    return NextResponse.json({ error: 'Failed to update post history entry' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deleted = await deletePostHistoryEntry(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Post history entry not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post history entry:', error);
    return NextResponse.json({ error: 'Failed to delete post history entry' }, { status: 500 });
  }
}
