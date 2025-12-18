# SM-Poster Development Plan

## Overview

A Next.js application for creating AI-powered social media posts with context awareness. Runs 100% locally with no authentication required.

## Architecture Decisions

### Data Storage: JSON Files

- **Why**: No setup, no passwords, no Docker, commits with code
- **Location**: `/data/` directory in project root
- **Files**:
  - `context.json` - Business info, events, dates
  - `post-history.json` - Abbreviated post records with dates
  - `platforms.json` - Platform credentials/tokens (gitignored)

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **AI**: DeepSeek API
- **Storage**: Local JSON files via `fs` in API routes
- **UI Components**: shadcn/ui

### Platform Integration Architecture

```
/lib/platforms/
  ├── base.ts          # Abstract platform interface
  ├── linkedin.ts      # LinkedIn implementation
  ├── facebook.ts      # Facebook implementation
  └── index.ts         # Platform registry
```

Each platform implements:
- `authenticate()` - OAuth flow
- `post(content)` - Publish post
- `validateCredentials()` - Check token validity

## Pages

### 1. Create Post (`/`)

- AI prompt input with context injection
- Platform selection (LinkedIn, Facebook)
- Preview before posting
- Post button that publishes and saves to history

### 2. Context Manager (`/context`)

- Add/edit business information
- Add/edit events and dates
- View all saved context
- Delete context entries

### 3. Post History (`/history`)

- View all past posts (abbreviated)
- Edit post history entries
- Delete entries
- Filter by platform/date

## API Routes

```
/api/
  ├── ai/generate      # Generate post with AI
  ├── context/         # CRUD for context
  ├── history/         # CRUD for post history
  └── platforms/
      ├── linkedin/    # LinkedIn OAuth & posting
      └── facebook/    # Facebook OAuth & posting
```

## Data Schemas

### Context Entry

```typescript
{
  id: string;
  type: 'business' | 'event' | 'date' | 'general';
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
```

### Post History Entry

```typescript
{
  id: string;
  platform: string;
  abbreviatedContent: string;  // Max 100 chars
  fullContent: string;
  postedAt: string;
  status: 'published' | 'draft' | 'failed';
}
```

## Environment Variables

```env
DEEPSEEK_API_KEY=       # Required for AI
LINKEDIN_CLIENT_ID=     # For LinkedIn posting
LINKEDIN_CLIENT_SECRET=
FACEBOOK_APP_ID=        # For Facebook posting
FACEBOOK_APP_SECRET=
```

## Security Notes

- `.env.local` for API keys (gitignored)
- `/data/platforms.json` for OAuth tokens (gitignored)
- No auth needed - local only
