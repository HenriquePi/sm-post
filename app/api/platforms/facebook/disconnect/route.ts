import { NextResponse } from 'next/server';
import { getPlatform } from '@/lib/platforms';

export async function POST() {
  const platform = getPlatform('facebook');
  if (!platform) {
    return NextResponse.json({ error: 'Platform not found' }, { status: 404 });
  }

  await platform.disconnect();
  return NextResponse.json({ success: true });
}
