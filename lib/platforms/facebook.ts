import { BasePlatform, PlatformConfig, PostResult } from './base';
import { getPlatformTokens, updatePlatformToken, deletePlatformToken } from '../data';

export class FacebookPlatform extends BasePlatform {
  readonly config: PlatformConfig = {
    name: 'facebook',
    displayName: 'Facebook',
    maxLength: 63206,
  };

  private get appId(): string {
    return process.env.FACEBOOK_APP_ID || '';
  }

  private get appSecret(): string {
    return process.env.FACEBOOK_APP_SECRET || '';
  }

  private get redirectUri(): string {
    return `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/platforms/facebook/callback`;
  }

  async isAuthenticated(): Promise<boolean> {
    const tokens = await getPlatformTokens();
    if (!tokens.facebook?.accessToken || !tokens.facebook?.pageAccessToken) return false;

    if (tokens.facebook.expiresAt) {
      const expiresAt = new Date(tokens.facebook.expiresAt);
      if (expiresAt < new Date()) return false;
    }

    return true;
  }

  getAuthUrl(): string {
    const scopes = ['pages_manage_posts', 'pages_read_engagement', 'pages_show_list'];
    const params = new URLSearchParams({
      client_id: this.appId,
      redirect_uri: this.redirectUri,
      scope: scopes.join(','),
      response_type: 'code',
      state: 'facebook_auth',
    });
    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
  }

  async handleCallback(code: string): Promise<boolean> {
    try {
      const tokenParams = new URLSearchParams({
        client_id: this.appId,
        client_secret: this.appSecret,
        redirect_uri: this.redirectUri,
        code,
      });

      const tokenResponse = await fetch(
        `https://graph.facebook.com/v18.0/oauth/access_token?${tokenParams.toString()}`
      );

      if (!tokenResponse.ok) {
        console.error('Facebook token exchange failed:', await tokenResponse.text());
        return false;
      }

      const tokenData = await tokenResponse.json();

      const pagesResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/accounts?access_token=${tokenData.access_token}`
      );

      if (!pagesResponse.ok) {
        console.error('Facebook pages fetch failed:', await pagesResponse.text());
        return false;
      }

      const pagesData = await pagesResponse.json();

      if (!pagesData.data || pagesData.data.length === 0) {
        console.error('No Facebook pages found');
        return false;
      }

      const page = pagesData.data[0];

      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + (tokenData.expires_in || 5184000));

      await updatePlatformToken('facebook', {
        accessToken: tokenData.access_token,
        pageId: page.id,
        pageAccessToken: page.access_token,
        expiresAt: expiresAt.toISOString(),
      });

      return true;
    } catch (error) {
      console.error('Facebook callback error:', error);
      return false;
    }
  }

  async post(content: string): Promise<PostResult> {
    try {
      const tokens = await getPlatformTokens();
      if (!tokens.facebook?.pageAccessToken || !tokens.facebook?.pageId) {
        return { success: false, error: 'Not authenticated with Facebook' };
      }

      const response = await fetch(
        `https://graph.facebook.com/v18.0/${tokens.facebook.pageId}/feed`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: content,
            access_token: tokens.facebook.pageAccessToken,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Facebook post failed:', errorText);
        return { success: false, error: `Facebook API error: ${response.status}` };
      }

      const result = await response.json();

      return {
        success: true,
        postId: result.id,
        url: `https://www.facebook.com/${result.id}`,
      };
    } catch (error) {
      console.error('Facebook post error:', error);
      return { success: false, error: String(error) };
    }
  }

  async disconnect(): Promise<void> {
    await deletePlatformToken('facebook');
  }
}
