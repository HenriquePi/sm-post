# SM-Poster Implementation Tasks

## Phase 1: Project Setup

- [x] Install dependencies (shadcn/ui, openai-compatible client, uuid)
- [x] Create `/data/` directory structure
- [x] Add `/data/platforms.json` to `.gitignore`
- [x] Create initial JSON data files with empty arrays
- [x] Set up environment variables template (`.env.example`)

## Phase 2: Core Infrastructure

- [x] Create data access utilities (`/lib/data.ts`)
  - [x] Read/write JSON files
  - [x] Type definitions for all data schemas
- [x] Create platform abstraction (`/lib/platforms/base.ts`)
- [x] Create platform registry (`/lib/platforms/index.ts`)

## Phase 3: API Routes

### Context API
- [x] `GET /api/context` - List all context entries
- [x] `POST /api/context` - Create context entry
- [x] `PUT /api/context/[id]` - Update context entry
- [x] `DELETE /api/context/[id]` - Delete context entry

### History API
- [x] `GET /api/history` - List all post history
- [x] `POST /api/history` - Create history entry
- [x] `PUT /api/history/[id]` - Update history entry
- [x] `DELETE /api/history/[id]` - Delete history entry

### AI API
- [x] `POST /api/ai/generate` - Generate post with context

### Platform APIs
- [x] LinkedIn OAuth callback route
- [x] LinkedIn post route
- [x] Facebook OAuth callback route
- [x] Facebook post route

## Phase 4: Platform Implementations

- [x] LinkedIn platform class
  - [x] OAuth 2.0 flow
  - [x] Post to personal/company page
  - [ ] Token refresh handling
- [x] Facebook platform class
  - [x] OAuth flow for business pages
  - [x] Post to business page
  - [ ] Token management

## Phase 5: UI Components

- [x] Layout with navigation
- [x] Context entry form component
- [x] Context list component
- [x] Post history list component
- [x] AI prompt input component
- [x] Platform selector component
- [x] Post preview component

## Phase 6: Pages

### Create Post Page (`/`)
- [x] AI prompt textarea
- [x] Context injection display
- [x] Platform multi-select
- [x] Generate button
- [x] Preview panel
- [x] Publish button
- [x] Success/error feedback

### Context Manager Page (`/context`)
- [x] Add new context form
- [x] List existing context entries
- [x] Edit context modal/inline
- [x] Delete with confirmation
- [ ] Filter by type

### Post History Page (`/history`)
- [x] List all posts with dates
- [x] Edit history entry modal
- [x] Delete with confirmation
- [ ] Filter by platform
- [ ] Filter by date range

## Phase 7: AI Integration

- [x] Build context prompt from saved context
- [x] Include recent post history for timeline awareness
- [x] Generate post with DeepSeek API
- [x] Handle API errors gracefully

## Phase 8: Polish

- [x] Loading states
- [x] Error handling UI
- [x] Toast notifications
- [x] Responsive design
- [ ] Keyboard shortcuts

## Phase 9: Testing

- [ ] Test JSON file operations
- [ ] Test API routes
- [ ] Test platform posting (sandbox/test accounts)
- [ ] End-to-end flow testing

---

## Priority Order

1. **Phase 1-2**: Foundation (do first) ✅
2. **Phase 3**: API routes (enables everything) ✅
3. **Phase 5-6**: UI (can work without platforms) ✅
4. **Phase 7**: AI integration ✅
5. **Phase 4**: Platform implementations (can add incrementally) ✅
6. **Phase 8-9**: Polish and testing (partial)
