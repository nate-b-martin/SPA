---
name: playwright-qa
description: QA workflow using playwright-cli for exploratory testing, test case generation, edge case discovery, and Playwright test debugging. Supports the full spec-driven testing cycle: plan, generate, heal.
allowed-tools: Bash(playwright-cli:*) Bash(npx:*) Bash(npm:*)
---

## When to use me

Use this skill when the user asks to "write tests", "find test coverage gaps", "explore the app", "generate test cases", "template a test", "find edge cases", "debug a failing test", "audit test coverage", "run exploratory testing", or "add tests for a feature". I combine playwright-cli for browser automation with the project's existing Playwright patterns (Page Object Model, fixtures, axe-core accessibility).

## Prerequisites

- `playwright-cli` installed: `npm install -g @playwright/cli@latest`
- Dev server running: `npm run dev` on `http://localhost:3000`
- Tests at `tests/e2e/`, Page Objects at `tests/e2e/page-objects/`
- Shared fixtures at `tests/fixtures.ts` provide `makeAxeBuilder`
- For debugging existing tests: Playwright installed in the project

## playwright-cli command reference

### Starting a session

```bash
# Default session (headless)
playwright-cli open http://localhost:3000

# Headed (watch the browser)
playwright-cli -s=qa open http://localhost:3000 --headed

# Named session with persistent profile
playwright-cli -s=qa open http://localhost:3000 --persistent

# Custom browser
playwright-cli -s=qa open http://localhost:3000 --browser=firefox

# List / close / kill sessions
playwright-cli list
playwright-cli -s=qa close
playwright-cli close-all
playwright-cli kill-all
```

### Core interaction

```bash
playwright-cli -s=qa goto /posts
playwright-cli -s=qa click e15
playwright-cli -s=qa click "getByRole('button', { name: /submit/i })"
playwright-cli -s=qa dblclick e7
playwright-cli -s=qa fill e5 "search query" --submit
playwright-cli -s=qa type "slow typing"
playwright-cli -s=qa hover e4
playwright-cli -s=qa check e12
playwright-cli -s=qa uncheck e12
playwright-cli -s=qa select e9 "option-value"
playwright-cli -s=qa upload ./document.pdf
playwright-cli -s=qa drag e2 e8
playwright-cli -s=qa drop e4 --data="text/plain=hello world"
playwright-cli -s=qa close
```

### Tabs

```bash
playwright-cli -s=qa tab-list
playwright-cli -s=qa tab-new https://example.com
playwright-cli -s=qa tab-close 2
playwright-cli -s=qa tab-select 0
```

### Keyboard & Mouse

```bash
playwright-cli -s=qa press Enter
playwright-cli -s=qa press Tab
playwright-cli -s=qa press ArrowDown
playwright-cli -s=qa keydown Shift
playwright-cli -s=qa keyup Shift
playwright-cli -s=qa mousemove 150 300
playwright-cli -s=qa mousedown
playwright-cli -s=qa mouseup
playwright-cli -s=qa mousewheel 0 100
```

### Navigation

```bash
playwright-cli -s=qa go-back
playwright-cli -s=qa go-forward
playwright-cli -s=qa reload
```

### Storage

```bash
playwright-cli -s=qa state-save auth.json
playwright-cli -s=qa state-load auth.json

# Cookies
playwright-cli -s=qa cookie-list
playwright-cli -s=qa cookie-get session_id
playwright-cli -s=qa cookie-set theme dark --domain=example.com --httpOnly
playwright-cli -s=qa cookie-delete session_id
playwright-cli -s=qa cookie-clear

# LocalStorage
playwright-cli -s=qa localstorage-list
playwright-cli -s=qa localstorage-get theme
playwright-cli -s=qa localstorage-set theme dark
playwright-cli -s=qa localstorage-delete theme
playwright-cli -s=qa localstorage-clear
```

### Snapshots & screenshots

```bash
playwright-cli -s=qa snapshot
playwright-cli -s=qa snapshot e5
playwright-cli -s=qa snapshot --filename=after-click.yaml
playwright-cli -s=qa snapshot --depth=4
playwright-cli -s=qa snapshot --boxes
playwright-cli -s=qa screenshot
playwright-cli -s=qa screenshot e5
playwright-cli -s=qa screenshot --filename=page.png
playwright-cli -s=qa pdf --filename=page.pdf
```

### Network mocking

```bash
# Mock with custom status
playwright-cli -s=qa route "**/*.jpg" --status=404

# Mock with JSON body
playwright-cli -s=qa route "**/api/contact" --body='{"ok":true}' --content-type=application/json

# Mock with custom headers
playwright-cli -s=qa route "**/api/data" --body='{"ok":true}' --header="X-Custom: value"

# Remove headers from requests
playwright-cli -s=qa route "**/*" --remove-header=cookie

# List / remove routes
playwright-cli -s=qa route-list
playwright-cli -s=qa unroute "**/*.jpg"
playwright-cli -s=qa unroute

# Offline simulation
playwright-cli -s=qa network-state-set offline
playwright-cli -s=qa network-state-set online
```

### DevTools & diagnostics

```bash
# Console messages
playwright-cli -s=qa console
playwright-cli -s=qa console error

# Network requests
playwright-cli -s=qa requests
playwright-cli -s=qa request 5
playwright-cli -s=qa request-headers 5
playwright-cli -s=qa response-body 5

# Tracing
playwright-cli -s=qa tracing-start
playwright-cli -s=qa tracing-stop

# Video recording
playwright-cli -s=qa video-start
playwright-cli -s=qa video-chapter "Checkout flow" --description="User adds item"
playwright-cli -s=qa video-show-actions
playwright-cli -s=qa video-hide-actions
playwright-cli -s=qa video-stop

# Arbitrary Playwright code
playwright-cli -s=qa run-code "await page.evaluate(() => document.title)"
playwright-cli -s=qa run-code --filename=script.js

# Element introspection
playwright-cli -s=qa eval "document.title"
playwright-cli -s=qa eval "el => el.textContent" e5
playwright-cli -s=qa eval "el => el.id" e5
playwright-cli -s=qa eval "el => el.getAttribute('data-testid')" e5

# Generate stable locator from element ref
playwright-cli -s=qa generate-locator e5
playwright-cli -s=qa generate-locator e5 --raw

# Highlight elements
playwright-cli -s=qa highlight e5
playwright-cli -s=qa highlight e5 --style="outline: 3px dashed red"
playwright-cli -s=qa highlight e5 --hide
playwright-cli -s=qa highlight --hide

# Resize viewport
playwright-cli -s=qa resize 375 667
playwright-cli -s=qa resize 1280 720

# Interactive annotation (user draws boxes, leaves notes)
playwright-cli -s=qa show --annotate
```

### Raw / JSON output

`--raw` strips status and snapshot sections, returning only the result value. `--json` wraps every reply as JSON.

```bash
playwright-cli --raw eval "document.title"
playwright-cli --raw snapshot > before.yml
playwright-cli -s=qa list --json
TOKEN=$(playwright-cli --raw cookie-get session_id)
```

## Test debugging workflow

When a Playwright test is failing, use `--debug=cli` to pause it and attach playwright-cli for interactive exploration.

### 1. Run the failing test in debug mode

```bash
PLAYWRIGHT_HTML_OPEN=never npx playwright test tests/e2e/<file>.spec.ts:<line> --debug=cli
```

Keep this running in the background and wait for the "Debugging Instructions" output showing a session name (e.g. `tw-abcdef`).

### 2. Attach to the paused test

```bash
playwright-cli attach tw-abcdef
```

### 3. Explore and fix

The test is paused at the start. Step through or resume to just before the failure:

```bash
playwright-cli snapshot           # Did the element change?
playwright-cli console            # App-side errors?
playwright-cli requests           # Failed network request?
playwright-cli show --annotate    # Ask user to point at the issue
```

Every action you perform generates Playwright TypeScript code in the output. Copy this into the test.

### 4. Rerun to confirm

Stop the background test, edit the test file, then rerun:

```bash
PLAYWRIGHT_HTML_OPEN=never npx playwright test tests/e2e/<file>.spec.ts --project=chromium
```

## Test generation workflow

Every playwright-cli interaction emits Playwright TypeScript code automatically. Collect this to build test files.

### Example: recording a login flow

```bash
playwright-cli -s=qa open http://localhost:3000/login
playwright-cli -s=qa snapshot
# Output: e1 [textbox "Email"], e2 [textbox "Password"], e3 [button "Sign In"]
playwright-cli -s=qa fill e1 "user@example.com"
# Output: await page.getByRole('textbox', { name: 'Email' }).fill('user@example.com');
playwright-cli -s=qa fill e2 "password123"
playwright-cli -s=qa click e3
```

### Building a test from generated code

```typescript
import { test, expect } from '@playwright/test'

test('login flow', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    await page.getByRole('textbox', { name: 'Email' }).fill('user@example.com')
    await page.getByRole('textbox', { name: 'Password' }).fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page).toHaveURL(/.*dashboard/)
})
```

### Adding assertions with generated locators

```bash
# Get a stable locator for an element ref
playwright-cli --raw generate-locator e5
# getByRole('button', { name: 'Submit' })

# Capture text content for toHaveText
playwright-cli --raw eval "el => el.textContent" e5

# Capture aria snapshot for toMatchAriaSnapshot
playwright-cli --raw snapshot
```

```typescript
await expect(page.getByRole('alert', { name: 'Success' })).toBeVisible()
await expect(page.getByTestId('main-header')).toHaveText('Welcome')
await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('user@example.com')
await expect(page).toMatchAriaSnapshot(`
  - heading "Welcome"
  - button "Sign out"
`)
```

## Spec-driven testing: plan → generate → heal

Full workflow for authoring and maintaining Playwright tests.

### Phase 1: Plan

1. **Create a seed test** — minimal test that lands the page in the starting state:

```typescript
// tests/seed.spec.ts
import { test } from '@playwright/test'

test('seed', async ({ page }) => {
    await page.goto('http://localhost:3000/')
})
```

2. **Explore the app** via the seed in debug mode:

```bash
PLAYWRIGHT_HTML_OPEN=never npx playwright test tests/seed.spec.ts --debug=cli
playwright-cli attach tw-XXXX
playwright-cli resume
playwright-cli snapshot
# Map: interactive elements, flows, edge cases, persistence, navigation
```

3. **Write the spec file** at `backlog/specs/<feature>.plan.md`:

```markdown
# Feature Test Plan

## Scenarios

### 1. Homepage

**Seed:** tests/seed.spec.ts

#### 1.1. should-render-homepage

**File:** tests/e2e/homepage.spec.ts

**Steps:**
  1. Navigate to /
    - expect: heading "Hey, I'm Nathan Martin" is visible
    - expect: banner navigation is visible
  2. Click the "All Posts" link
    - expect: URL changes to /posts
    - expect: posts list heading is visible
```

Guidelines:
- Each scenario is independent, starts from seed
- Scenario names are kebab-case, match the test file
- Cover happy path, validation, edge cases, persistence
- Steps at the user level, not API level

### Phase 2: Generate

For each scenario in the spec:

```bash
PLAYWRIGHT_HTML_OPEN=never npx playwright test <seed-file> --debug=cli
playwright-cli attach tw-XXXX
playwright-cli resume
```

Walk the scenario steps with playwright-cli. Every action emits TypeScript code. For each `- expect:` bullet, add an assertion. Collect the code and write the test file.

Rules:
- One test per file
- Import from `../fixtures` if it exists, else `@playwright/test`
- Stop the background test between scenarios

### Phase 3: Heal

Fix failing tests by debugging and reconciling with the spec:

1. Run failing test in debug mode and attach
2. Step through to the failure point
3. Snapshot, console, requests to diagnose
4. Fix the test (locator drift, assertion text, etc.)
5. If user-facing behaviour changed: update the spec
6. If it's a confirmed bug and the user agrees: `test.fixme(...)`
7. Rerun to confirm green

## Edge case discovery

For each page, systematically probe these dimensions with playwright-cli:

### Read states

```bash
playwright-cli -s=qa goto /page
playwright-cli -s=qa snapshot                          # empty state
playwright-cli -s=qa console                            # loading indicators

# Error state — mock API failure
playwright-cli -s=qa route "**/api/data" --abort
playwright-cli -s=qa goto /page
playwright-cli -s=qa snapshot
playwright-cli -s=qa console error
playwright-cli -s=qa unroute
```

### Interaction boundaries

```bash
# Empty form submit
playwright-cli -s=qa goto /contact
playwright-cli -s=qa click "getByRole('button', { name: /submit/i })"
playwright-cli -s=qa snapshot

# Extreme inputs
playwright-cli -s=qa fill e10 "<script>alert('xss')</script>"
playwright-cli -s=qa fill e10 "A".repeat(1000)

# Keyboard-only flow
playwright-cli -s=qa press Tab
playwright-cli -s=qa press Tab
playwright-cli -s=qa press Enter
```

### Responsive edges

```bash
playwright-cli -s=qa resize 320 800     # WCAG minimum
playwright-cli -s=qa goto /
playwright-cli -s=qa snapshot --boxes
playwright-cli -s=qa resize 1280 720    # Desktop
playwright-cli -s=qa run-code "await page.evaluate(() => document.body.style.zoom = '2')"
```

### Network edges

```bash
playwright-cli -s=qa network-state-set offline
playwright-cli -s=qa goto /posts
playwright-cli -s=qa snapshot
playwright-cli -s=qa network-state-set online

# Slow response
playwright-cli -s=qa run-code "async page => { await page.route('**/*', async route => { await new Promise(r => setTimeout(r, 3000)); await route.continue(); }) }"
```

## Coverage gap analysis

### Per-page checklist

| Test dimension | What to check | Example gap |
|---|---|---|
| Render | Basic content visible | Missing: heading, critical content |
| Empty state | No-data message | Missing: "no posts" fallback |
| Loading state | Skeleton/spinner | Missing: loading indicator |
| Error state | API failure handling | Missing: error message, retry |
| Form validation | Required fields, email, length | Missing: UX errors |
| Form submission | Success/failure/double-click guard | Missing: success feedback |
| Navigation | All links, back/forward, deep URLs | Missing: URL params, 404 |
| Keyboard | Tab order, focus visibility | Missing: keyboard-only flow |
| Responsive | Mobile/tablet/desktop layouts | Missing: 320px, zoom 200% |
| Theme | Light and dark mode | Missing: theme scans |
| Search/filter | Empty results, clear, URL sync | Missing: no-results, reset |
| Accessibility | Axe-core violations | Missing: WCAG 2.2 criteria |
| Network | Offline, slow, API failure | Missing: offline fallback |
| Storage | Theme/search persistence | Missing: reload persistence |

### Existing test coverage map

Check each spec file and note what dimensions it covers:

- `homepage.spec.ts` — render, navigation, theme, recent posts
- `posts.spec.ts` — render, search filter, navigation, accessibility
- `experiences.spec.ts` — render (check what else)
- `contact.spec.ts` — form fields, submission (check more)
- `accessibility-tests/accessibility.spec.ts` — axe-core scans per route
- `api/contact.spec.ts` — API validation, success, failure

## Template snippets

### Page Object template

```typescript
import { Page } from '@playwright/test'

export class FeaturePage {
    constructor(private page: Page) {}

    async goto() {
        await this.page.goto('/feature-path')
    }

    heading() {
        return this.page.getByRole('heading', { level: 1 })
    }

    submitButton() {
        return this.page.getByRole('button', { name: /submit/i })
    }
}
```

### Feature test template

```typescript
import { test, expect } from '@playwright/test'
import { FeaturePage } from './page-objects/FeaturePage'

test.describe('Feature Name', () => {
    test('should render', async ({ page }) => {
        const feature = new FeaturePage(page)
        await feature.goto()
        await expect(feature.heading()).toBeVisible()
    })

    test('should handle empty state', async ({ page }) => {
        const feature = new FeaturePage(page)
        await feature.goto()
    })
})
```

### Accessibility test template

```typescript
import { test, expect } from '../../fixtures'
import { FeaturePage } from '../page-objects/FeaturePage'
import type AxeBuilder from '@axe-core/playwright'

async function scan(makeAxeBuilder: () => AxeBuilder) {
    const results = await makeAxeBuilder().analyze()
    expect(results.violations).toEqual([])
}

test.describe('Accessibility - Feature', () => {
    test('should have no violations', async ({ page, makeAxeBuilder }) => {
        const feature = new FeaturePage(page)
        await feature.goto()
        await expect(feature.heading()).toBeVisible()
        await scan(makeAxeBuilder)
    })

    test('should have no violations - dark mode', async ({ page, makeAxeBuilder }) => {
        const feature = new FeaturePage(page)
        await feature.goto()
        const theme = await page.locator('html').getAttribute('class')
        if (theme === 'light') {
            await page.getByLabel(/switch to .* theme/i).click()
        }
        await scan(makeAxeBuilder)
    })
})
```

### Responsive test template

```typescript
import { test, expect } from '@playwright/test'
import { FeaturePage } from './page-objects/FeaturePage'

const viewports = [
    { width: 320, height: 800, name: 'mobile-narrow' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1280, height: 800, name: 'desktop' },
]

for (const vp of viewports) {
    test.describe(`Feature - ${vp.name}`, () => {
        test.use({ viewport: { width: vp.width, height: vp.height } })
        test('should render', async ({ page }) => {
            const feature = new FeaturePage(page)
            await feature.goto()
            await expect(feature.heading()).toBeVisible()
        })
    })
}
```

## Verification

1. **New tests pass**: `npx playwright test tests/e2e/<new-file>.spec.ts --project=chromium`
2. **All tests pass**: `npm run test`
3. **Lint clean**: `npm run lint`
4. **Build succeeds**: `npm run build`
5. **Close sessions**: `playwright-cli close-all`
