import { NextRequest, NextResponse } from 'next/server';
import { getContextEntry, updateContextEntry, deleteContextEntry } from '@/lib/data';
import type { ContextType } from '@/lib/types';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const entry = await getContextEntry(id);
    if (!entry) {
      return NextResponse.json({ error: 'Context entry not found' }, { status: 404 });
    }
    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error fetching context entry:', error);
    return NextResponse.json({ error: 'Failed to fetch context entry' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { type, title, content } = body as {
      type?: ContextType;
      title?: string;
      content?: string;
    };

    const entry = await updateContextEntry(id, { type, title, content });
    if (!entry) {
      return NextResponse.json({ error: 'Context entry not found' }, { status: 404 });
    }
    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error updating context entry:', error);
    return NextResponse.json({ error: 'Failed to update context entry' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deleted = await deleteContextEntry(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Context entry not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting context entry:', error);
    return NextResponse.json({ error: 'Failed to delete context entry' }, { status: 500 });
  }
}
