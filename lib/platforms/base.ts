export interface PostResult {
  success: boolean;
  postId?: string;
  error?: string;
  url?: string;
}

export interface PlatformConfig {
  name: string;
  displayName: string;
  icon?: string;
  maxLength?: number;
}

export abstract class BasePlatform {
  abstract readonly config: PlatformConfig;

  abstract isAuthenticated(): Promise<boolean>;

  abstract getAuthUrl(): string;

  abstract handleCallback(code: string): Promise<boolean>;

  abstract post(content: string): Promise<PostResult>;

  abstract disconnect(): Promise<void>;
}
