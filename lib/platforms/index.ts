import { BasePlatform } from './base';
import { LinkedInPlatform } from './linkedin';
import { FacebookPlatform } from './facebook';

export type { PostResult, PlatformConfig } from './base';
export { BasePlatform } from './base';

const platforms: Record<string, BasePlatform> = {
  linkedin: new LinkedInPlatform(),
  facebook: new FacebookPlatform(),
};

export function getPlatform(name: string): BasePlatform | null {
  return platforms[name] ?? null;
}

export function getAllPlatforms(): BasePlatform[] {
  return Object.values(platforms);
}

export function getPlatformNames(): string[] {
  return Object.keys(platforms);
}
