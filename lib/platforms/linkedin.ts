import { BasePlatform, PlatformConfig, PostResult } from './base';
import { getPlatformTokens, updatePlatformToken, deletePlatformToken } from '../data';

export class LinkedInPlatform extends BasePlatform {
  readonly config: PlatformConfig = {
    name: 'linkedin',
    displayName: 'LinkedIn',
    maxLength: 3000,
  };

  private get clientId(): string {
    return process.env.LINKEDIN_CLIENT_ID || '';
  }

  private get clientSecret(): string {
    return process.env.LINKEDIN_CLIENT_SECRET || '';
  }

  private get redirectUri(): string {
    return `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/platforms/linkedin/callback`;
  }

  async isAuthenticated(): Promise<boolean> {
    const tokens = await getPlatformTokens();
    if (!tokens.linkedin?.accessToken) return false;

    if (tokens.linkedin.expiresAt) {
      const expiresAt = new Date(tokens.linkedin.expiresAt);
      if (expiresAt < new Date()) return false;
    }

    return true;
  }

  getAuthUrl(): string {
    const scopes = ['openid', 'profile', 'w_member_social'];
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: scopes.join(' '),
      state: 'linkedin_auth',
    });
    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  }

  async handleCallback(code: string): Promise<boolean> {
    try {
      const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.redirectUri,
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
      });

      if (!tokenResponse.ok) {
        console.error('LinkedIn token exchange failed:', await tokenResponse.text());
        return false;
      }

      const tokenData = await tokenResponse.json();

      const userResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      if (!userResponse.ok) {
        console.error('LinkedIn user info failed:', await userResponse.text());
        return false;
      }

      const userData = await userResponse.json();

      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);

      await updatePlatformToken('linkedin', {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: expiresAt.toISOString(),
        userId: userData.sub,
      });

      return true;
    } catch (error) {
      console.error('LinkedIn callback error:', error);
      return false;
    }
  }

  async post(content: string): Promise<PostResult> {
    try {
      const tokens = await getPlatformTokens();
      if (!tokens.linkedin?.accessToken || !tokens.linkedin?.userId) {
        return { success: false, error: 'Not authenticated with LinkedIn' };
      }

      const postData = {
        author: `urn:li:person:${tokens.linkedin.userId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content,
            },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };

      const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokens.linkedin.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('LinkedIn post failed:', errorText);
        return { success: false, error: `LinkedIn API error: ${response.status}` };
      }

      const result = await response.json();
      const postId = result.id;

      return {
        success: true,
        postId,
        url: `https://www.linkedin.com/feed/update/${postId}`,
      };
    } catch (error) {
      console.error('LinkedIn post error:', error);
      return { success: false, error: String(error) };
    }
  }

  async disconnect(): Promise<void> {
    await deletePlatformToken('linkedin');
  }
}
