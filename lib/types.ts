export type ContextType = 'business' | 'event' | 'date' | 'general';

export interface ContextEntry {
  id: string;
  type: ContextType;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type PostStatus = 'published' | 'draft' | 'failed';

export interface PostHistoryEntry {
  id: string;
  platform: string;
  abbreviatedContent: string;
  fullContent: string;
  postedAt: string;
  status: PostStatus;
}

export interface PlatformTokens {
  linkedin?: {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: string;
    userId?: string;
  };
  facebook?: {
    accessToken: string;
    pageId?: string;
    pageAccessToken?: string;
    expiresAt?: string;
  };
}

export interface GeneratePostRequest {
  prompt: string;
  platforms: string[];
  includeContext?: boolean;
  includeHistory?: boolean;
}

export interface GeneratePostResponse {
  content: string;
  error?: string;
}
