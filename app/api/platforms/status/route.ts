import { NextResponse } from 'next/server';
import { getAllPlatforms } from '@/lib/platforms';

export async function GET() {
  const platforms = getAllPlatforms();
  const statuses: Record<string, boolean> = {};

  for (const platform of platforms) {
    statuses[platform.config.name] = await platform.isAuthenticated();
  }

  return NextResponse.json(statuses);
}
