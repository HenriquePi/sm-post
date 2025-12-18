import { NextResponse } from 'next/server';
import { getPlatform } from '@/lib/platforms';

export async function GET() {
  const platform = getPlatform('linkedin');
  if (!platform) {
    return NextResponse.json({ error: 'Platform not found' }, { status: 404 });
  }

  const authUrl = platform.getAuthUrl();
  return NextResponse.redirect(authUrl);
}
