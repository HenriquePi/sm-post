---
trigger: model_decision
description: When trying to use feature flags, refer to this doc
---

# Feature Flags System

## Overview

VoxelQuote uses a centralized feature flag system to control feature availability across different environments (production, staging, development). This allows us to:

- **Gradually roll out features** - Enable features in development/staging before production
- **A/B testing** - Test features with specific user groups
- **Emergency kill switches** - Quickly disable problematic features
- **Environment-specific features** - Enable debugging tools only in development

## Architecture

### Components

1. **Configuration** (`/frontend/src/lib/featureFlags/config.ts`)
   - Single source of truth for all feature flags
   - Defines enabled state per environment

2. **Context Provider** (`/frontend/src/contexts/FeatureFlagContext.tsx`)
   - React context for accessing feature flags
   - Provides hooks for checking feature state

3. **FeatureGate Component** (`/frontend/src/components/feature-flags/FeatureGate.tsx`)
   - Declarative component for conditional rendering

4. **Environment Detection** (`/frontend/src/lib/featureFlags/utils.ts`)
   - Determines current environment from env vars

## Usage

### 1. Hook-Based Conditional Rendering

```tsx
import { useFeatureFlag } from '@/lib/featureFlags'

function MyComponent() {
  const isQuickQuoteEnabled = useFeatureFlag('ai_quick_quote')

  if (!isQuickQuoteEnabled) {
    return <ComingSoonBadge />
  }

  return <AIQuickQuoteButton />
}
```

### 2. Component-Based Conditional Rendering

```tsx
import { FeatureGate } from '@/lib/featureFlags'

function MyComponent() {
  return (
    <FeatureGate flag="ai_quick_quote" fallback={<ComingSoonBadge />}>
      <AIQuickQuoteButton />
    </FeatureGate>
  )
}
```

### 3. Multiple Feature Checks

```tsx
import { useFeatureFlags } from '@/lib/featureFlags'

function MyComponent() {
  const { isEnabled, getEnabledFeatures } = useFeatureFlags()

  const showAdvancedFeatures = isEnabled('ai_quick_quote') && isEnabled('price_sheet_ai_conversion')

  if (showAdvancedFeatures) {
    return <AdvancedToolbar />
  }

  return <BasicToolbar />
}
```

### 4. Environment Information

```tsx
import { useFeatureFlags } from '@/lib/featureFlags'

function DebugPanel() {
  const { environment, environmentName, getEnabledFeatures } = useFeatureFlags()

  return (
    <div>
      <p>Environment: {environmentName}</p>
      <p>Enabled Features: {getEnabledFeatures().join(', ')}</p>
    </div>
  )
}
```

## Adding New Feature Flags

### Step 1: Add Type Definition

Edit `/frontend/src/lib/featureFlags/types.ts`:

```typescript
export type FeatureFlagKey = 'ai_quick_quote' | 'price_sheet_ai_conversion' | 'your_new_feature' // Add here
```

### Step 2: Add Configuration

Edit `/frontend/src/lib/featureFlags/config.ts`:

```typescript
export const featureFlagConfig: FeatureFlagConfig = {
  // ... existing flags
  your_new_feature: {
    key: 'your_new_feature',
    name: 'Your New Feature',
    description: 'Description of what this feature does',
    enabled: {
      production: false, // Disabled in production
      staging: true, // Enabled in staging
      development: true, // Enabled in development
    },
  },
}
```

### Step 3: Use the Flag

```tsx
import { useFeatureFlag } from '@/lib/featureFlags'

function MyComponent() {
  const isEnabled = useFeatureFlag('your_new_feature')

  if (!isEnabled) return null

  return <YourNewFeature />
}
```

## Environment Configuration

### Environment Variables

Set the environment in `.env.local`:

```bash
# Options: production, staging, development
NEXT_PUBLIC_APP_ENV=development
```

### Environment Detection Logic

1. **Explicit env var** - `NEXT_PUBLIC_APP_ENV` takes precedence
2. **NODE_ENV fallback** - Maps `NODE_ENV` to environments:
   - `production` → `production`
   - `test` → `development`
   - `development` → `development`

### Deployment Environments

**Development:**

```bash
NEXT_PUBLIC_APP_ENV=development
```

**Staging:**

```bash
NEXT_PUBLIC_APP_ENV=staging
```

**Production:**

```bash
NEXT_PUBLIC_APP_ENV=production
```

## Best Practices

### 1. Feature Flag Naming

- Use snake_case: `ai_quick_quote`
- Be descriptive: `price_sheet_ai_conversion` not `ai_feature_2`
- Group related features: `ai_*`, `price_sheet_*`

### 2. Gradual Rollout

```typescript
your_new_feature: {
  enabled: {
    development: true,  // Week 1: Test in dev
    staging: true,      // Week 2: Test in staging
    production: false,  // Week 3: Enable in production
  },
}
```

### 3. Feature Flag Lifecycle

1. **Development** - Enable in dev only
2. **Testing** - Enable in staging
3. **Beta** - Enable in production for specific users (future: user-level flags)
4. **General Availability** - Enable for all users
5. **Cleanup** - Remove flag once feature is stable (make it permanent)

### 4. Emergency Kill Switch

If a feature causes issues in production:

```typescript
problematic_feature: {
  enabled: {
    production: false,  // ← Disable immediately
    staging: true,
    development: true,
  },
}
```

Redeploy to disable the feature without code changes.

### 5. Feature Dependencies

If Feature B depends on Feature A:

```tsx
function MyComponent() {
  const { isEnabled } = useFeatureFlags()

  const canUseFeatureB = isEnabled('feature_a') && isEnabled('feature_b')

  if (!canUseFeatureB) return null

  return <FeatureB />
}
```

### 6. Testing with Feature Flags

```tsx
// In tests, mock the feature flag context
import { FeatureFlagProvider } from '@/contexts/FeatureFlagContext'

// Override environment for testing
process.env.NEXT_PUBLIC_APP_ENV = 'development'

test('renders feature when enabled', () => {
  render(
    <FeatureFlagProvider>
      <MyComponent />
    </FeatureFlagProvider>
  )

  expect(screen.getByText('Feature Content')).toBeInTheDocument()
})
```

## Current Feature Flags

| Flag                        | Production | Staging | Development | Description                        |
| --------------------------- | ---------- | ------- | ----------- | ---------------------------------- |
| `ai_quick_quote`            | ✅         | ✅      | ✅          | AI-powered quick quote generation  |
| `price_sheet_ai_conversion` | ✅         | ✅      | ✅          | Convert text/files to price sheets |
| `overhead_management`       | ✅         | ✅      | ✅          | Business overhead tracking         |
| `ai_section_management`     | ✅         | ✅      | ✅          | AI section matching/assignment     |
| `price_sheet_update`        | ✅         | ✅      | ✅          | AI-powered price sheet updates     |
| `inline_quote_editing`      | ✅         | ✅      | ✅          | Edit quotes inline during review   |

## Future Enhancements

### User-Level Feature Flags

```typescript
// Future: Check user-specific flags
const isEnabled = useFeatureFlag('beta_feature', { userId: user.id })
```

### Remote Configuration

```typescript
// Future: Fetch flags from API
const flags = await fetchFeatureFlags()
```

### Analytics Integration

```typescript
// Future: Track feature usage
trackFeatureUsage('ai_quick_quote', { enabled: true })
```

## Troubleshooting

### Feature Not Showing

1. **Check environment** - Verify `NEXT_PUBLIC_APP_ENV` is set correctly
2. **Check config** - Ensure flag is enabled for current environment
3. **Check provider** - Verify `FeatureFlagProvider` is in provider tree
4. **Check console** - Look for warning: `[FeatureFlags] Unknown feature flag: ...`

### Environment Not Detected

1. **Restart dev server** - Environment variables require restart
2. **Check .env.local** - Verify `NEXT_PUBLIC_APP_ENV` is set
3. **Check build** - In production, verify env var is set in deployment

### TypeScript Errors

1. **Add type** - Add new flag to `FeatureFlagKey` type
2. **Add config** - Add flag to `featureFlagConfig` object
3. **Restart TypeScript** - Reload VS Code window

## Files

- `/frontend/src/lib/featureFlags/types.ts` - Type definitions
- `/frontend/src/lib/featureFlags/config.ts` - Feature flag configuration
- `/frontend/src/lib/featureFlags/utils.ts` - Utility functions
- `/frontend/src/lib/featureFlags/index.ts` - Public exports
- `/frontend/src/contexts/FeatureFlagContext.tsx` - React context and hooks
- `/frontend/src/components/feature-flags/FeatureGate.tsx` - Conditional rendering component
- `/frontend/src/components/providers.tsx` - Provider integration
- `/frontend/.env.example` - Environment variable template
