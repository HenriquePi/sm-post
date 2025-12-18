import { NextRequest, NextResponse } from 'next/server';
import { getPlatform } from '@/lib/platforms';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/?error=facebook_auth_denied', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=facebook_no_code', request.url));
  }

  const platform = getPlatform('facebook');
  if (!platform) {
    return NextResponse.redirect(new URL('/?error=platform_not_found', request.url));
  }

  const success = await platform.handleCallback(code);
  if (!success) {
    return NextResponse.redirect(new URL('/?error=facebook_auth_failed', request.url));
  }

  return NextResponse.redirect(new URL('/?success=facebook_connected', request.url));
}
