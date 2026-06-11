---
name: accessibility
description: Implement and test WCAG 2 accessibility standards using Playwright with @axe-core/playwright. Covers automated scans, manual checks, keyboard navigation, color contrast, focus management, ARIA, semantic HTML, and screen reader compatibility.
---

## When to use me

Use this skill when the user asks to "add accessibility tests", "implement a11y", "make this WCAG compliant", "add axe-core checks", "check keyboard navigation", "fix accessibility issues", "test for screen readers", or "run accessibility audits". I cover both automated (axe-core) and manual (keyboard, focus, color contrast, ARIA) testing workflows.

## Project context

This project uses `@axe-core/playwright` with a custom fixture at `tests/fixtures.ts` that provides `makeAxeBuilder` to every test. The fixture is configured to scan WCAG 2 A, AA, and best-practice tags. Accessibility tests live in `tests/e2e/accessibility-tests/` and follow the Page Object Model pattern.

**Key files:**
- `tests/fixtures.ts` — `makeAxeBuilder` fixture, configures axe tags and exclusions
- `tests/e2e/accessibility-tests/accessibility.spec.ts` — existing per-route axe scans
- `playwright.config.ts` — tests run across Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari

## Workflow

1. Determine what needs accessibility work (new component, new page, existing feature, or whole-site audit)
2. Run the existing axe-core scans: `npm run test` — check `tests/e2e/accessibility-tests/accessibility.spec.ts`
3. For new pages/components, write Playwright accessibility tests following the patterns below
4. Apply fixes for any violations, then re-run scans to confirm
5. Perform manual accessibility checks (keyboard, focus, color contrast, screen reader)

## Automated testing with axe-core

### Adding a new page to the accessibility suite

Use the existing fixture and helper pattern from `tests/e2e/accessibility-tests/accessibility.spec.ts`:

```typescript
import { test, expect } from '../../fixtures'
import type { Page } from '@playwright/test'
import type AxeBuilder from '@axe-core/playwright'
import { PageObject } from '../page-objects/PageObject'

async function runAxeTest(page: Page, makeAxeBuilder: () => AxeBuilder) {
    const results = await makeAxeBuilder().analyze()
    expect(results.violations).toEqual([])
}

test.describe('Accessibility - PageName', () => {
    test('should have no accessibility violations', async ({
        page,
        makeAxeBuilder
    }) => {
        const pageObj = new PageObject(page)
        await pageObj.goto()
        await expect(pageObj.heading()).toBeVisible()
        await runAxeTest(page, makeAxeBuilder)
    })

    test('should have no accessibility violations - toggle theme', async ({
        page,
        makeAxeBuilder
    }) => {
        const pageObj = new PageObject(page)
        await pageObj.goto()
        await expect(pageObj.heading()).toBeVisible()
        await toggleLightTheme(page)
        await runAxeTest(page, makeAxeBuilder)
        await toggleDarkTheme(page)
        await runAxeTest(page, makeAxeBuilder)
    })
})
```

### Testing interactive states

Scan the page after common user interactions to catch dynamic accessibility issues:

```typescript
// After search/filter
await pageObj.searchPosts('query')
await runAxeTest(page, makeAxeBuilder)

// After form fill
await contact.fillForm({ name: 'Test', email: 'test@example.com', message: 'Hello' })
await runAxeTest(page, makeAxeBuilder)

// After modal/dialog opens
await page.getByRole('button', { name: /open/i }).click()
await runAxeTest(page, makeAxeBuilder)

// After navigation
await page.getByRole('link', { name: /about/i }).click()
await runAxeTest(page, makeAxeBuilder)
```

### Configuring axe tags

The project fixture currently scans `wcag2a`, `wcag2aa`, `wcag21a`, and `best-practice`. For stricter checks, add WCAG 2.2 or AAA tags:

```typescript
// In tests/fixtures.ts — expand as needed
new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag22a', 'wcag22aa', 'best-practice'])
```

Available tag groups: `wcag2a`, `wcag2aa`, `wcag2aaa`, `wcag21a`, `wcag21aa`, `wcag21aaa`, `wcag22a`, `wcag22aa`, `wcag22aaa`, `best-practice`, `section508`, `experimental`, `cat.*` (category-specific).

### Excluding known false positives

If a known issue has been reviewed and accepted, exclude it from scans:

```typescript
new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .exclude('#element-id')
    .exclude('.known-issue-class')
```

## Manual accessibility checks

These checks cannot be automated by axe-core and must be verified manually (or with additional Playwright scripts).

### Keyboard navigation

Every interactive element must be reachable and operable via keyboard alone.

```typescript
// Playwright: tab through focusable elements
async function testKeyboardNavigation(page: Page, selectors: string[]) {
    for (const selector of selectors) {
        await page.keyboard.press('Tab')
        const focused = page.locator(':focus')
        await expect(focused).toMatch(selector)
    }
}
```

Checklist:
- All links, buttons, form controls, and custom widgets are focusable
- Tab order follows a logical reading sequence
- No focus traps (Tab cycles through elements without getting stuck)
- Escape closes modals/dialogs/menus
- Enter/Space activates buttons and links
- Arrow keys navigate lists, menus, tabs, and sliders
- Skip to content link is the first focusable element

### Focus management

Focus must be visible and predictable.

```typescript
// Playwright: check focus-visible styles
await expect(page.locator('*:focus-visible')).toHaveCSS(
    'outline-style',
    'solid'
)

// Playwright: verify focus is moved to new content
await page.getByRole('button', { name: /open modal/i }).click()
await expect(page.locator('[role="dialog"]')).toBeFocused()
```

Checklist:
- `focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring` on all interactive elements
- Focus moves to newly opened content (modals, dialogs, expanded sections)
- Focus returns to trigger element when closing a dialog
- Skip links (`#main-content`, `#skip-nav`) are visible on focus
- No `outline: none` without providing a visible focus indicator

### Color contrast

```typescript
// Playwright: check computed styles against contrast ratios
async function checkContrast(page: Page, elementSelector: string) {
    const color = await page.locator(elementSelector).evaluate(el =>
        getComputedStyle(el).color
    )
    const bg = await page.locator(elementSelector).evaluate(el =>
        getComputedStyle(el).backgroundColor
    )
    // Use a WCAG contrast ratio library or visual inspection
    return { color, bg }
}
```

Checklist:
- Text smaller than 24px/18.66px bold: 4.5:1 minimum contrast ratio (WCAG AA)
- Text 24px+ or 18.66px+ bold: 3:1 minimum contrast ratio (WCAG AA)
- UI components and graphical objects: 3:1 minimum contrast ratio
- Non-text content (icons, charts): 3:1 minimum contrast ratio
- Focus indicators: 3:1 contrast against adjacent colors
- Text over background images or gradients: sufficient contrast throughout

### ARIA and semantic HTML

```typescript
// Playwright: verify landmark structure
test('page has semantic landmarks', async ({ page }) => {
    await expect(page.locator('header, [role="banner"]')).toHaveCount(1)
    await expect(page.locator('nav, [role="navigation"]')).toHaveCount(1)
    await expect(page.locator('main, [role="main"]')).toHaveCount(1)
    await expect(page.locator('footer, [role="contentinfo"]')).toHaveCount(1)
})

// Playwright: verify heading hierarchy
test('headings follow a logical hierarchy', async ({ page }) => {
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
    let prevLevel = 0
    for (const h of headings) {
        const tag = await h.evaluate(el => el.tagName.toLowerCase())
        const level = parseInt(tag.replace('h', ''))
        expect(level - prevLevel).toBeLessThanOrEqual(1)
        prevLevel = level
    }
})

// Playwright: verify images have alt text
test('all images have alt text', async ({ page }) => {
    const images = page.locator('img')
    const count = await images.count()
    for (let i = 0; i < count; i++) {
        await expect(images.nth(i)).toHaveAttribute('alt', /.*/)
    }
})
```

Checklist:
- Semantic elements used: `<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`, `<aside>`
- Landmarks are not duplicated without distinct labels (`aria-label` or `aria-labelledby`)
- Heading levels increment by one (`h1` → `h2` → `h3`), never skip levels
- Every `<img>` has descriptive `alt` text (empty `alt=""` is acceptable for decorative images)
- Form inputs have associated `<label>` elements
- Error messages are associated with inputs via `aria-describedby` or `aria-errormessage`
- Live regions (`aria-live="polite"`) announce dynamic content (search results, loading states)
- ARIA roles match the native semantics of elements (use semantic HTML over ARIA where possible)
- No ARIA attributes on elements that already have that semantic natively

### Responsive and zoom accessibility

```typescript
// Playwright: test at 200% zoom
await page.evaluate(() => document.body.style.zoom = '2')
await runAxeTest(page, makeAxeBuilder)

// Playwright: test at viewport width 320px (small mobile)
await page.setViewportSize({ width: 320, height: 800 })
await page.waitForLoadState('networkidle')
await runAxeTest(page, makeAxeBuilder)
```

Checklist:
- Content does not overflow or get clipped at 200% zoom (WCAG 1.4.4)
- No horizontal scrolling at 320px viewport width (WCAG 1.4.10)
- Touch targets are at least 44x44px (WCAG 2.5.8)
- Content reflows in a single column on narrow viewports

### Forms and error handling

```typescript
// Playwright: verify required fields have proper attributes
test('required fields have required attribute and aria-required', async ({
    page
}) => {
    const requiredInputs = page.locator('[required], [aria-required="true"]')
    const count = await requiredInputs.count()
    expect(count).toBeGreaterThan(0)
})

// Playwright: test form error announcements
test('form errors are announced to screen readers', async ({ page }) => {
    await page.getByRole('button', { name: /submit/i }).click()
    const errors = page.locator('[aria-invalid="true"]')
    await expect(errors.first()).toBeVisible()
    const errorMsg = page.locator('[role="alert"], [aria-live="assertive"]')
    await expect(errorMsg.first()).toBeVisible()
})
```

Checklist:
- All form controls have labels (`<label>` with `htmlFor` or `aria-label`)
- Required fields have `required` attribute or `aria-required="true"`
- Error messages are programmatically associated with their input (`aria-describedby`)
- Form submission errors are announced via `role="alert"` or `aria-live="assertive"`
- Autocomplete attributes on name, email, and address fields (`autocomplete="name"`, `autocomplete="email"`)

### Screen reader testing

```typescript
// Playwright: verify dynamic content announcements
test('live region announces search results', async ({ page }) => {
    const liveRegion = page.locator('[aria-live="polite"]')
    await expect(liveRegion).toHaveText(/results/i)
})

// Playwright: check that aria-hidden elements are not focusable
test('decorative elements are hidden from screen readers', async ({
    page
}) => {
    const hiddenElements = page.locator('[aria-hidden="true"]')
    const count = await hiddenElements.count()
    for (let i = 0; i < count; i++) {
        const el = hiddenElements.nth(i)
        const isFocusable = await el.evaluate(el =>
            el.matches(
                'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
        )
        expect(isFocusable).toBe(false)
    }
})
```

Checklist:
- Screen reader can navigate all content: no `aria-hidden="true"` on focusable elements
- Status messages use `role="status"` or `aria-live="polite"`
- Loading states include `sr-only` text updates
- Custom widgets have appropriate roles, states, and properties (`aria-expanded`, `aria-selected`, `aria-current`)
- Icon-only buttons have `aria-label` describing the action
- Icon links have `aria-label` or visible text
- PDFs and downloadable documents indicate file type and size in link text

## Existing patterns in this project

### ARIA patterns used in components

| Pattern | Usage | File |
|---|---|---|
| `aria-hidden='true'` | Decorative icons and arrows | `components/intro.tsx`, `components/footer.tsx` |
| `role='status'` + `sr-only` | Loading indicator | `components/loading.tsx` |
| `aria-label` | Theme toggle button | `components/theme-toggle.tsx` |
| `aria-label` | Search input and clear button | `components/posts-with-search.tsx` |
| `sr-only` class | Screen-reader-only description text | `components/footer.tsx` |
| `focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring` | All interactive elements through global styles | `app/globals.css` |

### WCAG tag configuration

The project fixture at `tests/fixtures.ts` currently scans:
- `wcag2a` — WCAG 2.0 Level A (25 success criteria)
- `wcag2aa` — WCAG 2.0 Level AA (13 additional criteria)
- `wcag21a` — WCAG 2.1 Level A (5 additional criteria)
- `best-practice` — Common sense accessibility patterns

### Theme variant testing

Every page should be scanned in both light and dark modes because contrast ratios differ between themes. Use the existing helpers from `tests/e2e/accessibility-tests/accessibility.spec.ts`:

```typescript
async function toggleLightTheme(page: Page) {
    let currentTheme = await page.locator('html').getAttribute('class')
    if (currentTheme == 'dark') {
        await page.getByLabel(/switch to .* theme/i).click()
    }
    await expect(page.locator("//html[@class='light']")).toBeVisible()
}

async function toggleDarkTheme(page: Page) {
    let currentTheme = await page.locator('html').getAttribute('class')
    if (currentTheme == 'light') {
        await page.getByLabel(/switch to .* theme/i).click()
    }
    await expect(page.locator("//html[@class='dark']")).toBeVisible()
}
```

## Fixing common violations

When axe-core reports violations, follow these remediation patterns:

### 1. Missing heading structure

Add proper heading hierarchy to the component or layout. Each page must have exactly one `h1`.

### 2. Insufficient color contrast

Adjust Tailwind theme colors in `tailwind.config.ts` to meet WCAG AA ratios. Use the ring color for focus indicators: `focus-visible:ring-ring`.

### 3. Missing form labels

Every `<input>`, `<select>`, and `<textarea>` must have an associated `<label>`:

```tsx
<label htmlFor="name" className="sr-only">Name</label>
<input id="name" type="text" aria-label="Name" />
```

### 4. Non-unique ARIA landmarks

When multiple `<nav>` or `<aside>` elements exist, give each a unique label:

```tsx
<nav aria-label="Main navigation">...</nav>
<nav aria-label="Footer navigation">...</nav>
```

### 5. Image missing alt text

Every `<img>` needs `alt`. Use empty `alt=""` for decorative images, descriptive text for informative images.

### 6. Focusable elements with no visible focus

Ensure the Tailwind ring utility is applied to all interactive elements. The global `focus-visible` styles in `app/globals.css` should handle this, but check for custom components that may override it.

### 7. Buttons with no accessible name

Icon-only buttons need `aria-label`:

```tsx
<button aria-label="Close dialog">
    <XIcon aria-hidden="true" />
</button>
```

## Verification

1. **Run automated scans**: `npm run test` — runs all Playwright tests including accessibility
2. **Run only accessibility tests**: `npx playwright test accessibility-tests/accessibility.spec.ts`
3. **Check specific browser**: `npx playwright test --project=chromium accessibility-tests/`
4. **Inspect violations in detail**: open `playwright-report/index.html` after a run
5. **Manual verification**: test keyboard navigation, zoom to 200%, viewport at 320px, use a screen reader (VoiceOver, NVDA, or JAWS)

When fixing violations, always:
- Fix the root cause in the component rather than using axe exclusions
- Re-run tests after each fix to confirm the violation is resolved
- Add both light and dark theme scan tests for any new page
