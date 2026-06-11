# Playwright Testing Plan

## Prerequisite: Fix `testDir` in `playwright.config.ts`

The config currently has `testDir: './e2e'` but tests live in `tests/e2e/`. Change it to:

```ts
testDir: './tests/e2e',
```

Without this, no tests will run.

---

## Phase 1: Infrastructure & Setup

### 1.1 Install @axe-core/playwright

```bash
npm install -D @axe-core/playwright
```

### 1.2 Create shared test fixture at `tests/e2e/fixtures.ts`

Extends Playwright's base `test` to give every spec access to an accessibility scan helper.

```typescript
import { test as base } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

type AxeFixture = {
    makeAxeBuilder: () => AxeBuilder
}

export const test = base.extend<AxeFixture>({
    makeAxeBuilder: async ({ page }, useFixture) => {
        const makeAxeBuilder = () =>
            new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'best-practice'])
                .exclude('#commonly-reused-element-with-known-issue')

        await useFixture(makeAxeBuilder)
    }
})

export { expect } from '@playwright/test'

```

### 1.3 Verify axe-core integration

Run a quick smoke test to ensure the fixture works before building out all a11y tests.

```bash
npx playwright test --project=chromium -g "accessibility" --headed
```

---

## Phase 2: Accessibility Testing

### 2.1 Create `tests/e2e/accessibility.spec.ts`

One `test.describe` block per page route. Each test:
1. Navigates to the page
2. Waits for content to be visible
3. Runs `const results = await makeAxeBuilder().analyze()`
4. Asserts `expect(results.violations).toEqual([])`

**Pages to cover:**

| Route | What to assert is visible before scan |
|---|---|
| `/` (homepage) | `home.heading()`, intro text, recent posts |
| `/posts` | `posts.heading()`, at least one post link |
| `/posts/[slug]` | `h1` title, article content |
| `/experiences` | `experiences.heading()`, at least one image |
| `/experiences/[slug]` | `h1` title, project content |
| `/contact` | `contact.heading()`, name input, submit button |

**Example:**

```typescript
import { test, expect } from '../fixtures'
import { HomePage } from './page-objects/HomePage'

test.describe('Accessibility - Homepage', () => {
  test('should have no accessibility violations', async ({ page, makeAxeBuilder }) => {
    const home = new HomePage(page)
    await home.goto()
    await expect(home.heading()).toBeVisible()
    const results = await makeAxeBuilder().analyze()
    expect(results.violations).toEqual([])
  })
})
```

**Tips:**
- Use `import { test, expect } from '../fixtures'` (not `@playwright/test`) in accessibility specs
- Call `analyze()` **after** confirming key content is visible
- Add a dark-theme variant: toggle theme, wait, then scan again
- For detail pages, use `page.goto('/posts/some-slug')` directly instead of clicking through UI (faster)

### 2.2 Add baseline a11y scan to existing spec files

Add one test per existing spec:

- `homepage.spec.ts` — add `should have no accessibility violations`
- `contact.spec.ts` — add `should have no accessibility violations` (idle state + error state)
- `posts.spec.ts` — add `should have no accessibility violations` (pre- and post-search)
- `experiences.spec.ts` — add `should have no accessibility violations`

In these files, import from `../../fixtures` and use the destructured `test` (not from `@playwright/test`).

---

## Phase 3: API Testing

### 3.1 Create directory structure

```
tests/e2e/
  api/
    contact.spec.ts
```

### 3.2 Create `tests/e2e/api/contact.spec.ts`

Use Playwright's `page.request` (APIRequestContext) — no browser UI needed. Mock Resend via `page.route()`.

**Test cases:**

```typescript
import { test, expect } from '../../fixtures'

test.describe('Contact API', () => {
  test('POST /api/contact with valid data returns success', async ({ page }) => {
    await page.route('**/resend.dev/**', route => route.fulfill({ status: 200 }))

    const response = await page.request.post('/api/contact', {
      data: { name: 'Test', email: 'test@example.com', message: 'Hello' }
    })
    expect(response.status()).toBe(200)
    expect(await response.json()).toEqual({ success: true })
  })

  test('POST /api/contact with missing fields returns 400', async ({ page }) => {
    const response = await page.request.post('/api/contact', {
      data: { name: '', email: '', message: '' }
    })
    expect(response.status()).toBe(400)
    expect(await response.json()).toEqual({ error: 'All fields are required' })
  })

  test('POST /api/contact with invalid email returns 400', async ({ page }) => {
    const response = await page.request.post('/api/contact', {
      data: { name: 'Test', email: 'not-an-email', message: 'Hello' }
    })
    expect(response.status()).toBe(400)
    expect(await response.json()).toEqual({ error: 'Invalid email address' })
  })

  test('POST /api/contact when Resend fails returns 500', async ({ page }) => {
    await page.route('**/resend.dev/**', route => route.abort('connectionfailed'))

    const response = await page.request.post('/api/contact', {
      data: { name: 'Test', email: 'test@example.com', message: 'Hello' }
    })
    expect(response.status()).toBe(500)
    expect(await response.json()).toEqual({ error: 'Failed to send message' })
  })
})
```

**Key points:**
- `page.route('**/resend.dev/**')` intercepts the outbound Resend HTTP call
- Tests are fast (no browser rendering) and fully deterministic
- No env vars or Resend API key needed in CI

---

## Phase 4: Enhanced UI Automation

### 4.1 Create `tests/e2e/responsive.spec.ts`

Iterate over mobile and tablet viewports, test critical flows.

```typescript
import { test, expect } from '../fixtures'
import { HomePage } from './page-objects/HomePage'
import { ContactPage } from './page-objects/ContactPage'

const viewports = [
  { width: 375, height: 667, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
]

for (const viewport of viewports) {
  test.describe(`Responsive - ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } })

    test('homepage header navigation is accessible', async ({ page }) => {
      const home = new HomePage(page)
      await home.goto()
      await expect(home.postsLink()).toBeVisible()
      await expect(home.contactLink()).toBeVisible()
    })

    test('contact form is usable', async ({ page }) => {
      const contact = new ContactPage(page)
      await contact.goto()
      await expect(contact.nameInput()).toBeVisible()
      await contact.fillForm({ name: 'Test', email: 'a@b.com', message: 'Hi' })
      await expect(contact.submitButton()).toBeVisible()
    })
  })
}
```

**Pages to test:** Homepage, Posts list, Contact form, Experiences grid.

### 4.2 Create `tests/e2e/keyboard-navigation.spec.ts`

```typescript
test('can navigate header links with keyboard', async ({ page }) => {
  const home = new HomePage(page)
  await home.goto()

  await page.keyboard.press('Tab')
  await expect(home.postsLink()).toBeFocused()

  await page.keyboard.press('Tab')
  // needs experiencesLink() added to HomePage
  await expect(page.getByRole('link', { name: /experiences/i })).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(home.contactLink()).toBeFocused()
})
```

**Elements to test:** Header nav links, Contact form fields, Posts search → reset → post links.

### 4.3 Create `tests/e2e/error-states.spec.ts`

```typescript
test('should display 404 page for unknown routes', async ({ page }) => {
  const response = await page.goto('/nonexistent-page')
  expect(response?.status()).toBe(404)
  await expect(page.getByText(/not found/i)).toBeVisible()
})

test('should show error message on form submission failure', async ({ page }) => {
  await page.route('**/api/contact', route =>
    route.fulfill({ status: 500, body: JSON.stringify({ error: 'Failed to send message' }) })
  )
  const contact = new ContactPage(page)
  await contact.goto()
  await contact.fillForm({ name: 'Test', email: 'a@b.com', message: 'Hi' })
  await contact.submitForm()
  await expect(page.getByText(/failed to send/i)).toBeVisible()
})
```

### 4.4 Enhance form validation tests in `contact.spec.ts`

Replace the current "check required attribute" test with actual validation behavior:

```typescript
test('should show validation popup on empty required fields', async ({ page }) => {
  const contact = new ContactPage(page)
  await contact.goto()
  await contact.submitForm()
  await expect(page).toHaveURL('/contact') // form wasn't submitted
})

test('should clear form after successful submission', async ({ page }) => {
  await page.route('**/api/contact', route =>
    route.fulfill({ status: 200, body: JSON.stringify({ success: true }) })
  )
  const contact = new ContactPage(page)
  await contact.goto()
  await contact.fillForm({ name: 'Test', email: 'a@b.com', message: 'Hi' })
  await contact.submitForm()
  await expect(contact.nameInput()).toHaveValue('')
  await expect(contact.emailInput()).toHaveValue('')
  await expect(contact.messageTextarea()).toHaveValue('')
  await expect(page.getByText(/successfully/i)).toBeVisible()
})
```

### 4.5 Add theme persistence test

```typescript
test('should persist theme across page reload', async ({ page }) => {
  const home = new HomePage(page)
  await home.goto()

  await home.themeToggle().click()
  await expect(page.locator('html')).toHaveClass(/dark/)

  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)
})
```

---

## Phase 5: Page Object Improvements

### 5.1 Fix `ExperiencesPage` brittle selectors

**Current** (`tests/e2e/page-objects/ExperiencesPage.ts`):
```typescript
projectLinks() {
  return this.page.locator('.grid > li > a')
}
```

**Fix:** Add `aria-label` to the `<Link>` in `components/experiences.tsx`:

```tsx
<Link href={`/experiences/${experience.slug}`} aria-label={`View ${experience.title}`}>
```

Then use accessible locator:
```typescript
projectLinks() {
  return this.page.getByRole('link', { name: /view /i })
}
```

Also scope `projectImages()` — currently `getByRole('img')` matches all images including header logo. Either:
- Add `aria-label` to experience images
- Scope by container: `this.page.locator('ul.grid img')` or `this.page.locator('[role="list"] img')`

### 5.2 Add detail page objects

**`tests/e2e/page-objects/PostDetailPage.ts`:**

```typescript
import { Page } from '@playwright/test'

export class PostDetailPage {
  constructor(private page: Page) {}

  async goto(slug: string) {
    await this.page.goto(`/posts/${slug}`)
  }

  backLink() {
    return this.page.getByRole('link', { name: /back to posts/i })
  }

  title() {
    return this.page.getByRole('heading', { level: 1 })
  }

  meta() {
    return this.page.locator('header p.text-xs')
  }

  content() {
    return this.page.locator('main.prose')
  }
}
```

**`tests/e2e/page-objects/ExperienceDetailPage.ts`** — same pattern.

### 5.3 Add missing methods to `HomePage`

```typescript
experiencesLink() {
  return this.page.getByRole('link', { name: /experiences/i })
}

logoLink() {
  return this.page.getByRole('link', { name: /nm/i })
}
```

### 5.4 Test reset button in `posts.spec.ts`

Current page object has `resetButton()` but no test uses it. Add:

```typescript
test('reset button clears search filter', async ({ page }) => {
  const posts = new PostsPage(page)
  await posts.goto()
  await posts.searchPosts('MDX')
  await expect(posts.resetButton()).toBeVisible()
  await posts.clearSearch()
  await expect(posts.searchInput()).toHaveValue('')
  await expect(posts.resetButton()).not.toBeVisible()
})
```

### 5.5 Header fragment (optional)

Shared fragment for header interactions:

```typescript
// tests/e2e/page-objects/HeaderFragment.ts
export class HeaderFragment {
  constructor(private page: Page) {}

  logo() {
    return this.page.getByRole('link', { name: /nm/i })
  }

  navLinks() {
    return this.page.getByRole('navigation').getByRole('link')
  }

  themeToggle() {
    return this.page.getByLabel(/switch to .* theme/i)
  }
}
```

---

## Phase 6: Visual Regression (Optional)

### 6.1 Create `tests/e2e/visual-regression.spec.ts`

```typescript
test('homepage matches snapshot', async ({ page }) => {
  const home = new HomePage(page)
  await home.goto()
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.02,
  })
})
```

### 6.2 Generate baseline screenshots

```bash
npx playwright test --project=chromium tests/e2e/visual-regression.spec.ts --update-snapshots
```

Commit the generated `tests/e2e/visual-regression.spec.ts-snapshots/` directory to git.

---

## Phase 7: CI & Documentation Updates

### 7.1 Update `testing-instructions.mdc`

Edit `.cursor/rules/testing-instructions.mdc` to add sections for:
- **Accessibility testing** — axe-core fixture pattern, WCAG tags to scan
- **API testing** — `page.request`, route interception, `e2e/api/` directory convention
- **Visual regression** — screenshot thresholds, baseline management
- **Responsive testing** — viewport array pattern with `test.use`
- **Keyboard navigation** — `toBeFocused()` matcher, tab-flow testing

### 7.2 Verify CI still works

GitHub Actions config should already work — just ensure Playwright browsers are installed. No major CI changes needed unless you add visual regression snapshots (no extra setup required).

---

## Execution Order

```
Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 5 ──► Phase 4 ──► Phase 6 ──► Phase 7
```

- **Phases 1-3** are foundational (fixtures, a11y, API tests)
- **Phase 5** (page object fixes) should come before Phase 4 so new UI tests use clean selectors
- **Phase 6** is optional and can be deferred
- **Phase 7** should be last to capture all new patterns

## Running Tests

```bash
# All tests
npm test

# Specific file
npx playwright test tests/e2e/accessibility.spec.ts

# API tests only
npx playwright test tests/e2e/api/

# Update visual snapshots
npx playwright test --update-snapshots

# UI mode
npm run test:ui

# Headed mode (watch what happens)
npm run test:headed
```
