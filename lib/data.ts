import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { ContextEntry, PostHistoryEntry, PlatformTokens } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readJsonFile<T>(filename: string, defaultValue: T): Promise<T> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch {
    return defaultValue;
  }
}

async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Context operations
export async function getContextEntries(): Promise<ContextEntry[]> {
  return readJsonFile<ContextEntry[]>('context.json', []);
}

export async function getContextEntry(id: string): Promise<ContextEntry | null> {
  const entries = await getContextEntries();
  return entries.find((e) => e.id === id) ?? null;
}

export async function createContextEntry(
  entry: Omit<ContextEntry, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ContextEntry> {
  const entries = await getContextEntries();
  const now = new Date().toISOString();
  const newEntry: ContextEntry = {
    ...entry,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };
  entries.push(newEntry);
  await writeJsonFile('context.json', entries);
  return newEntry;
}

export async function updateContextEntry(
  id: string,
  updates: Partial<Omit<ContextEntry, 'id' | 'createdAt'>>
): Promise<ContextEntry | null> {
  const entries = await getContextEntries();
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) return null;

  entries[index] = {
    ...entries[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await writeJsonFile('context.json', entries);
  return entries[index];
}

export async function deleteContextEntry(id: string): Promise<boolean> {
  const entries = await getContextEntries();
  const filtered = entries.filter((e) => e.id !== id);
  if (filtered.length === entries.length) return false;
  await writeJsonFile('context.json', filtered);
  return true;
}

// Post history operations
export async function getPostHistory(): Promise<PostHistoryEntry[]> {
  return readJsonFile<PostHistoryEntry[]>('post-history.json', []);
}

export async function getPostHistoryEntry(id: string): Promise<PostHistoryEntry | null> {
  const entries = await getPostHistory();
  return entries.find((e) => e.id === id) ?? null;
}

export async function createPostHistoryEntry(
  entry: Omit<PostHistoryEntry, 'id'>
): Promise<PostHistoryEntry> {
  const entries = await getPostHistory();
  const newEntry: PostHistoryEntry = {
    ...entry,
    id: uuidv4(),
  };
  entries.unshift(newEntry);
  await writeJsonFile('post-history.json', entries);
  return newEntry;
}

export async function updatePostHistoryEntry(
  id: string,
  updates: Partial<Omit<PostHistoryEntry, 'id'>>
): Promise<PostHistoryEntry | null> {
  const entries = await getPostHistory();
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) return null;

  entries[index] = {
    ...entries[index],
    ...updates,
  };
  await writeJsonFile('post-history.json', entries);
  return entries[index];
}

export async function deletePostHistoryEntry(id: string): Promise<boolean> {
  const entries = await getPostHistory();
  const filtered = entries.filter((e) => e.id !== id);
  if (filtered.length === entries.length) return false;
  await writeJsonFile('post-history.json', filtered);
  return true;
}

// Platform tokens operations
export async function getPlatformTokens(): Promise<PlatformTokens> {
  return readJsonFile<PlatformTokens>('platforms.json', {});
}

export async function savePlatformTokens(tokens: PlatformTokens): Promise<void> {
  await writeJsonFile('platforms.json', tokens);
}

export async function updatePlatformToken<K extends keyof PlatformTokens>(
  platform: K,
  token: PlatformTokens[K]
): Promise<void> {
  const tokens = await getPlatformTokens();
  tokens[platform] = token;
  await savePlatformTokens(tokens);
}

export async function deletePlatformToken(platform: keyof PlatformTokens): Promise<void> {
  const tokens = await getPlatformTokens();
  delete tokens[platform];
  await savePlatformTokens(tokens);
}

// Utility to abbreviate content for history
export function abbreviateContent(content: string, maxLength: number = 100): string {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength - 3) + '...';
}
