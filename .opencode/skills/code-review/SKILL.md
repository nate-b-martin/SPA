---
name: code-review
description: Review staged/uncommitted changes before pushing, covering linting, types, builds, tests, Next.js App Router patterns, Tailwind, Playwright E2E, a11y, and project conventions derived from AGENTS.md and APP-AGENT.md
---

## When to use me

Use this skill when the user asks for code review before pushing, such as "review my code", "review my branch", "code review my changes", or "check my code before I push". I examine staged and unstaged changes, run validation gates, and produce a structured report.

## Setup

1. Determine the changes to review:
   - First check `git diff --cached --stat` for staged changes
   - If nothing staged, fall back to `git diff --stat` for unstaged changes
   - Collect the list of changed files
2. Note the project context from AGENTS.md and APP-AGENT.md (App Router, TypeScript strict, Tailwind CSS, Playwright E2E)

## Validation gates

Run each gate and capture the full output. Report pass/fail clearly.

1. **Lint**: `npm run lint` — ESLint with `next/core-web-vitals` and `next/typescript` presets
2. **Build**: `npm run build` — TypeScript strict mode + Next.js production build
3. **Test**: `npm run test` — Playwright E2E across Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari

If any gate fails, include the relevant error output in your report.

## Per-file code review

For each changed file, systematically check the applicable categories below. Reference conventions from AGENTS.md and APP-AGENT.md where noted.

### Next.js App Router patterns (see APP-AGENT.md)

- `app/` directory structure: each folder = route segment, `page.tsx` = route component
- `layout.tsx`: wraps child routes, contains `<html>`/`<body>` with theme providers
- `page.tsx` components should be `async` for data fetching
- Dynamic routes use `[slug]` folders; access params via `const { slug } = await params`
- Use `generateStaticParams()` for static generation with dynamic routes
- Call `notFound()` for missing resources
- Export `metadata` objects for SEO (title, description, openGraph, twitter)
- Import global CSS via `import './globals.css'` in root layout only

### TypeScript (strict mode — tsconfig.json: `"strict": true`)

- All components must have explicit prop types (interface or type)
- No implicit `any` — use proper TypeScript types
- Use `@/*` path alias for imports (e.g., `@/components/ui/button`)
- Async functions should have proper return types
- Avoid type assertions (`as`) where possible; prefer type guards

### Tailwind CSS (see AGENTS.md — no inline styles)

- NO inline styles (`style={{}}`) — use Tailwind utility classes only
- Use `cn()` from `@/lib/utils` for conditional class merging (`clsx` + `tailwind-merge`)
- Use theme design tokens instead of hardcoded values:
  - `bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`
  - `border-border`, `bg-accent`, `text-accent-foreground`
  - `bg-card`, `bg-secondary`, `bg-destructive`
- Use responsive modifiers: `sm:`, `md:`, `lg:`
- Follow section patterns: `className='pb-24 pt-40'` for page sections, `container max-w-3xl` for content containers
- No custom CSS files unless absolutely necessary

### CSS custom properties (globals.css)

- HSL custom properties must use consistent format throughout — either all space-separated (`240 5.9% 10%`) or all comma-separated (`240, 5.9%, 10%`), never mixed
- When converting CSS variable formats, verify lightness percentages are preserved exactly. For example, `--muted-foreground` going from `46.1%` to `14%` would be a breaking visual change
- Check that hardcoded color values in JS/TSX (e.g., `.replace()` calls in mdx-content) match the corresponding CSS custom property values in globals.css

### Components (see AGENTS.md naming conventions)

- Files: kebab-case (`button.tsx`, `header.tsx`)
- Components: PascalCase (`Button`, `Header`)
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Functional components with hooks only (no class components, except ErrorBoundary which uses class component pattern)
- Reusable components in `components/`, UI primitives in `components/ui/`
- UI primitives should use `forwardRef` + `displayName` pattern (see `components/ui/button.tsx`)
- Use `Slot` from `@radix-ui/react-slot` for polymorphic components (asChild pattern)

### Imports & formatting (see AGENTS.md)

- Absolute imports only: `import X from '@/components/...'`
- Single quotes, no semicolons, 2-space tabs (Prettier config)
- No unused imports — ESLint will flag these
- Group imports logically: React → libraries → project components → utils

### MDX content

- Files live in `content/posts/` or `content/experiences/`
- Must have YAML frontmatter with: `title`, `summary`, `publishedAt`, `author`
- Optional frontmatter: `image`
- Slug derived from filename (strip `.mdx` extension)
- Content uses MDX syntax — inline React components are allowed

### Playwright E2E tests (see AGENTS.md)

- Tests in `tests/e2e/` directory as `.spec.ts` files (migrated from `e2e/`)
- Page Objects in `tests/e2e/page-objects/` following the Page Object Model pattern
- Tests must be deterministic and independent (no shared state)
- Prefer ARIA role/label selectors (`getByRole`, `getByLabel`) over CSS selectors
- Test accessibility and responsive design
- Each test file should be focused on a single feature/page
- **No placeholder selectors in fixtures or tests** — `#commonly-reused-element-with-known-issue` and similar generic placeholders must be replaced with real selectors or removed
- Fixture files (`tests/fixtures.ts`) should use `exclude` sparingly and with specific, documented selectors

### Accessibility

- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>` — prefer semantic elements over generic `<div>` containers
  - Content sections that are self-contained (blog posts, experience details) should use `<article>` not `<main>`
- All interactive elements must be keyboard-navigable
- `focus-visible` ring styles on focusable elements: `focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`
- Images must have descriptive `alt` text
- Icons should have `aria-hidden='true'` + `sr-only` text for screen readers
- Buttons/icons need `aria-label` when they lack visible text
- **Check `aria-label` values for typos** — common misspellings: "Increace" → "Increase", "submmit" → "submit", "delet" → "delete"
- Use `sr-only` class for screen-reader-only content

### Error handling (see AGENTS.md)

- Client components: wrap with `ErrorBoundary` from `@/components/error-boundary`
- Async operations: use try/catch with user-friendly fallbacks
- Data fetching errors: return `null` and handle gracefully in the UI (see `lib/posts.ts` pattern)

### Security

- No hardcoded secrets, API keys, or credentials
- Environment variables via `process.env` for all configuration
- Validate user input (e.g., contact form in `app/api/contact/route.ts`)
- Use `rel='noreferrer noopener'` on external links

## Output format

Present results in this structure:

```
## Code Review Results

### ✅ / ❌ Validation Gates
- Lint: [pass/fail] — details if fail
- Build: [pass/fail] — details if fail
- Tests: [pass/fail] — details if fail

### 🔴 Errors (must fix)
- file:line — Description of issue with suggested fix

### 🟡 Warnings (should fix)
- file:line — Description of issue with suggested fix

### 🔵 Suggestions (nice to have)
- file:line — Description of potential improvement

### 📋 Fix Plan
1. Step one...
2. Step two...
3. ...
```

Each issue entry should include:
- File path and line number
- Clear description of the problem
- Severity classification
- Concrete suggested fix
