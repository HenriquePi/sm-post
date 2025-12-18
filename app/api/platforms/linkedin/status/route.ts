import { NextResponse } from 'next/server';
import { getPlatform } from '@/lib/platforms';

export async function GET() {
  const platform = getPlatform('linkedin');
  if (!platform) {
    return NextResponse.json({ error: 'Platform not found' }, { status: 404 });
  }

  const isAuthenticated = await platform.isAuthenticated();
  return NextResponse.json({ authenticated: isAuthenticated });
}
