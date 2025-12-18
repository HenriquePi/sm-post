import { NextRequest, NextResponse } from 'next/server';
import { getContextEntries, createContextEntry } from '@/lib/data';
import type { ContextType } from '@/lib/types';

export async function GET() {
  try {
    const entries = await getContextEntries();
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching context entries:', error);
    return NextResponse.json({ error: 'Failed to fetch context entries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, content } = body as {
      type: ContextType;
      title: string;
      content: string;
    };

    if (!type || !title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const entry = await createContextEntry({ type, title, content });
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('Error creating context entry:', error);
    return NextResponse.json({ error: 'Failed to create context entry' }, { status: 500 });
  }
}
