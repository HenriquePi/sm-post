---
trigger: manual
---

# VoxelQuote Workspace Rules

## Test-Driven Development (TDD)

### Core TDD Principles

**For New Features:**

1. **RED** - Write the test first (it will fail)
2. **GREEN** - Write minimal code to make it pass
3. **REFACTOR** - Clean up code while keeping tests green

**For Existing Code:**

- Write tests to document current behaviour before refactoring
- Focus on critical paths first (quote flow, auth, file uploads)
- Add tests gradually as you work on features

### Testing Stack

**Backend:**

- `vitest` - Fast unit test runner
- `supertest` - API endpoint testing
- `testcontainers` - Real database for integration tests
- `@vitest/ui` - Test UI

**Frontend:**

- `vitest` - Unit test runner
- `@testing-library/react` - Component testing
- `@testing-library/user-event` - User interaction testing
- `msw` - Mock API calls

**E2E:**

- `playwright` - End-to-end testing

### Test Organization

**Backend:**

```
backend/
  src/
    services/
      service.ts
      service.test.ts          # Unit tests next to implementation
    routes/
      route.ts
      route.test.ts            # Integration tests next to routes
  tests/
    integration/
      feature.api.test.ts      # Full API integration tests
    e2e/
      flow.test.ts             # End-to-end flows
```

**Frontend:**

```
frontend/
  src/
    components/
      Component.tsx
      Component.test.tsx       # Component tests next to implementation
    lib/
      util.ts
      util.test.ts             # Unit tests next to utilities
  tests/
    e2e/
      feature.spec.ts          # Playwright E2E tests
```

### Test Writing Guidelines

**DO:**

- ✅ Use Arrange-Act-Assert (AAA) pattern
- ✅ Write descriptive test names: `it('should return 404 when project not found')`
- ✅ Test behaviour, not implementation details
- ✅ Test edge cases (empty lists, special characters, long inputs)
- ✅ Use test factories for creating test data
- ✅ Mock external services (email, OneDrive, etc.)
- ✅ Keep tests independent (no shared state between tests)

**DON'T:**

- ❌ Test framework code (React rendering, Express routing)
- ❌ Test implementation details (internal methods, component state)
- ❌ Make tests dependent on each other
- ❌ Use real external services in tests
- ❌ Aim for 100% coverage (focus on valuable tests)

### Test Pattern Example

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('FeatureService', () => {
  let service: FeatureService

  beforeEach(() => {
    service = new FeatureService()
  })

  describe('methodName', () => {
    it('should do something when condition is met', async () => {
      // Arrange - Set up test data
      const testData = createTestData()

      // Act - Perform the action
      const result = await service.methodName(testData)

      // Assert - Verify the outcome
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })

    it('should handle edge case', async () => {
      // Test edge cases
    })

    it('should throw error when invalid input', async () => {
      // Test error handling
      await expect(service.methodName(null)).rejects.toThrow('Invalid input')
    })
  })
})
```

### Running Tests

**Backend:**

```bash
npm test                    # Run all tests
npm test -- --watch         # Watch mode
npm test -- --coverage      # Coverage report
npm test -- --ui            # UI mode
npm test service.test.ts    # Specific file
```

**Frontend:**

```bash
npm test                    # Run all tests
npm test -- --watch         # Watch mode
npm test -- --coverage      # Coverage report
```

**E2E:**

```bash
npx playwright test         # Run all E2E tests
npx playwright test --ui    # UI mode
```

### Coverage Goals

- **Phase 1 (40%):** Critical paths (quote flow, auth, file uploads)
- **Phase 2 (70%):** All services, API endpoints, critical components
- **Phase 3 (85%):** Edge cases, error handling, UI components

**Note:** Focus on valuable tests, not 100% coverage.

### When Implementing Features

1. **Before writing code:** Write the test first
2. **Run the test:** Verify it fails (RED)
3. **Write minimal code:** Make the test pass (GREEN)
4. **Run the test:** Verify it passes
5. **Refactor:** Clean up code while keeping tests green
6. **Add integration tests:** Test API endpoints
7. **Add E2E tests:** Test complete user flows (if applicable)

### Test Doubles

**Use mocks/stubs for:**

- External services (email, OneDrive, Azure)
- Database calls (in unit tests)
- Time-dependent operations
- Random number generation

**Example:**

```typescript
// Mock entire module
vi.mock('../services/emailService', () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
}))

// Spy on method
const spy = vi.spyOn(service, 'method')
spy.mockResolvedValue({ id: 'test-123' })
```

### Integration with CI/CD

- All tests must pass before merging
- Run tests on every push/PR
- Generate coverage reports
- Use test containers for integration tests in CI

---

**Reference:** See `docs/TDD_GUIDE.md` for detailed examples and patterns.
