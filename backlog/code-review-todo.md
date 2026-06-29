# Code Review TODO — June 19, 2026

## 🔴 Must Fix

- [x] **Remove unused `Page` import** — `tests/e2e/homepage.spec.ts:1`
      `import { test, expect, Page } from '@playwright/test'` — `Page` is unused. Remove it.
      ```ts
      import { test, expect } from '@playwright/test'
      ```

- [x] **Fix color-contrast violation on primary button (light mode)** — `tests/e2e/contact.spec.ts:52`
      New a11y test fails: `.bg-primary` button computes `#fafafa` text on `#ffffff` bg (ratio 1.04:1, needs 4.5:1).
      Likely a CSS variable resolution issue with `--primary` / `--primary-foreground`. Investigate and fix in `app/globals.css` or the button styling in `components/ui/button.tsx`.

## 🟡 Should Fix

- [x] **Remove commented-out placeholder in fixtures** — `tests/fixtures.ts:13`
      Delete the commented line instead of just commenting it out:
      ```ts
      // .exclude('#commonly-reused-element-with-known-issue')  // ← remove this
      ```

- [x] **Extra blank lines in homepage spec** — `tests/e2e/homepage.spec.ts:3-7`
      Remove stray blank lines inside the describe block and the trailing newline at end of file.

## 🔵 Nice to Have

- [x] **Use theme tokens in `.prose` custom properties** — `app/globals.css:86-94`
      Hardcoded hex colors (`#4b5563`, `#111827`, `#6b7280`) in `.prose` block should use CSS custom properties or Tailwind theme tokens instead.

- [x] **Visual regression: fade-in animation no longer fades** — `app/globals.css:120-150`
      `@keyframes fadeInTop` had its `opacity` properties removed; elements now only slide down without fading in. Previously animated `opacity: 0 → 1` + `translateY(-20px → 0)`. Verify this was intentional.
