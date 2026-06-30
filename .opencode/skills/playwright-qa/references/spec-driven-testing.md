# Spec-driven testing: plan → generate → heal

End-to-end workflow for authoring and maintaining Playwright tests using playwright-cli.

## 1. Plan

Goal: produce a spec file at `backlog/specs/<feature>.plan.md`.

### 1.1 Create a seed test

Minimal test that lands the page in the starting state:

```typescript
// tests/seed.spec.ts
import { test } from '@playwright/test'

test('seed', async ({ page }) => {
    await page.goto('http://localhost:3000/')
})
```

### 1.2 Explore the app via the seed

```bash
PLAYWRIGHT_HTML_OPEN=never npx playwright test tests/seed.spec.ts --debug=cli
# wait for "Debugging Instructions" and session name tw-XXXX
playwright-cli attach tw-XXXX
playwright-cli resume
playwright-cli snapshot
playwright-cli click e5
playwright-cli eval "location.href"
```

Map out:
- Interactive surfaces (forms, buttons, lists, filters, modals)
- Primary user journeys
- Edge cases: empty states, validation, very long input
- Persistence: reload, storage, URL fragments
- Navigation: URL changes, back/forward behaviour

### 1.3 Write the spec file

```markdown
# Feature Test Plan

## Application Overview

<What the feature does and why it matters.>

## Scenarios

### 1. Group Name

**Seed:** tests/seed.spec.ts

#### 1.1. kebab-case-scenario-name

**File:** tests/e2e/<group>/kebab-case-scenario-name.spec.ts

**Steps:**
  1. <User-level step>
    - expect: <observable outcome>
  2. <Next step>
    - expect: <outcome>
```

Rules:
- Each scenario is independent; always start from seed
- Scenario names = kebab-case = test filenames
- Cover happy path, edge cases, validation, negative flows
- Write steps at the user level, not API level

## 2. Generate

### 2.1 One scenario at a time

```bash
PLAYWRIGHT_HTML_OPEN=never npx playwright test <seed-file> --debug=cli
playwright-cli attach tw-XXXX
playwright-cli resume
```

Walk each step with playwright-cli. Every action emits Playwright TypeScript. For each `- expect:` bullet, add an assertion.

Collect the generated code into the test file:

```typescript
// spec: specs/feature.plan.md, seed: tests/seed.spec.ts
import { test, expect } from '../fixtures'  // or '@playwright/test'

test.describe('Group Name', () => {
    test('should kebab-case-scenario-name', async ({ page }) => {
        // 1. Note: step text
        await page.getByRole('link', { name: /all posts/i }).click()

        await expect(page.getByRole('heading')).toContainText('Posts')
    })
})
```

### 2.2 Assertions from playwright-cli

```bash
# Generate stable locator
playwright-cli --raw generate-locator e5

# Capture expected value
playwright-cli --raw eval "el => el.textContent" e5

# Capture aria snapshot
playwright-cli --raw snapshot
```

### 2.3 Multiple scenarios

Loop 2.1 over each scenario, restarting the seed between each. Stop the background test between scenarios.

### 2.4 Run generated tests

```bash
PLAYWRIGHT_HTML_OPEN=never npx playwright test tests/e2e/<group>/<scenario>.spec.ts
```

## 3. Heal

### 3.1 Find failures

```bash
PLAYWRIGHT_HTML_OPEN=never npx playwright test
```

### 3.2 Debug one failure

```bash
PLAYWRIGHT_HTML_OPEN=never npx playwright test tests/e2e/<file>.spec.ts:<line> --debug=cli
playwright-cli attach tw-XXXX
```

Step to just before the failure, then diagnose:

```bash
playwright-cli snapshot
playwright-cli console
playwright-cli requests
playwright-cli show --annotate
```

Common causes: selector drift, label rename, timing, assertion text mismatch.

### 3.3 Apply the fix

Update the test file with corrected locators or assertions. Stop the background test. Rerun to confirm green. Never skip hooks or add sleeps.

### 3.4 Reconcile with the spec

- Fix was purely technical → leave spec alone
- User-visible behaviour changed → update spec
- App change vs. regression → **stop and ask the user**

### 3.5 Mark confirmed bugs

If the user confirms it's a bug:

```typescript
test.fixme('should do the thing', async ({ page }) => {
    // Bug confirmed by user: <date>
    // Expected: <outcome>
    // Actual: <observed>
})
```

Never silently skip.
