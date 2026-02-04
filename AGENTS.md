# AGENTS.md

## Agent Orchestration

This agent acts as an orchestrator, delegating specialized tasks to domain-specific agents:

- **Frontend tasks**: Use APP-AGENT.md guidelines for Next.js App Router development
- **Component tasks**: Follow component patterns in components/ directory
- **Testing tasks**: Use Playwright E2E patterns from testing-instructions.mdc
- **Content tasks**: Follow MDX structure in content/ directory

## Commands

### Build & Development
- **Build**: `npm run build` - Production build
- **Dev**: `npm run dev` - Start development server on localhost:3000
- **Start**: `npm run start` - Start production server

### Testing (Playwright E2E)
- **Test**: `npm run test` - Run all Playwright tests
- **Single test**: `npx playwright test filename.spec.ts` - Run specific test file
- **Test UI**: `npm run test:ui` - Run tests with UI mode for debugging
- **Test headed**: `npm run test:headed` - Run tests in headed mode (visible browser)
- **Test specific browser**: `npx playwright test --project=chromium`
- **Test with trace**: `npx playwright test --trace on`

### Code Quality
- **Lint**: `npm run lint` - Run ESLint (Next.js config)

## Code Style Guidelines

### Imports & Formatting
- Use absolute imports with `@/` prefix: `import Component from '@/components/ui/button'`
- Follow Prettier config: single quotes, no semicolons, 2-space tabs, printWidth: 80
- Use `arrowParens: avoid` - omit parens when possible
- Use `trailingComma: none` - no trailing commas
- Use `jsxSingleQuote: true` - single quotes in JSX
- Use `proseWrap: always` for markdown files
- Import order: React/Next imports first, then external libraries, then internal imports

### TypeScript & Types
- All components must be typed with TypeScript
- Use explicit types for props and state interfaces
- Strict mode enabled in tsconfig.json
- Use `type` keyword for type definitions when possible
- Prefer interfaces for component props with the naming convention `ComponentNameProps`
- Use `Readonly<>` wrapper for children props when appropriate

### Naming Conventions
- Components: PascalCase (e.g., `Button`, `Header`, `HomePage`)
- Files: kebab-case (e.g., `button.tsx`, `home-page.tsx`)
- Variables: camelCase (e.g., `isLoading`, `userData`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- Type definitions: PascalCase with descriptive names (e.g., `ButtonProps`, `UserProfile`)
- Test files: `*.spec.ts` pattern

### React & Next.js
- Use functional components with React hooks only (no class components)
- Use `React.forwardRef` for components that need ref forwarding
- Set `displayName` for all forwardRef components
- Follow App Router structure (`app/` directory)
- Use `async` components for data fetching in Server Components
- Place reusable UI components in `components/ui/` directory
- Place feature components in `components/` root
- Use Next.js font optimization (e.g., `next/font/google`)

### Styling (Tailwind CSS)
- Use Tailwind CSS utility classes for all styling - no inline styles
- Use the `cn()` utility from `@/lib/utils` for conditional class merging
- Use `class-variance-authority` (cva) for component variants
- Follow the project's color system using CSS variables (e.g., `bg-primary`, `text-foreground`)
- Use responsive prefixes (sm:, md:, lg:, xl:) for responsive design
- Support dark mode with `dark:` prefixes
- Use standard spacing scale ( Tailwind's default )

### Error Handling
- Use error boundaries for component error handling (see `components/error-boundary.tsx`)
- Wrap async operations in try/catch blocks
- Provide user-friendly error messages
- Never expose internal error details to users in production
- Handle loading states appropriately with loading components

### Testing Standards

#### Playwright E2E Testing
- Use TypeScript for all test files
- Follow Page Object Model (POM) pattern: Create reusable page object classes
- Place page objects in `e2e/page-objects/` directory
- Use accessible selectors: `getByRole`, `getByLabelText`, `getByTestId`
- Avoid brittle CSS selectors like `.nth-child()` or dynamic classes
- Test critical user flows: navigation, forms, theme switching
- Test accessibility and keyboard navigation
- Test responsive design with multiple viewports (desktop, mobile)
- Mock external API calls to avoid flakiness
- Use `test.describe` and `test.step` for organization
- All tests must be deterministic and independent (no test dependencies)
- Tests run on Chromium, Firefox, WebKit, and mobile emulators

### Security Best Practices
- Never hardcode secrets or API keys in the codebase
- Validate all user inputs
- Use environment variables for configuration (`.env.local`)
- Sanitize any dynamic content rendered from user input

### Component Patterns
- Keep components small, focused, and reusable
- Extract shared logic into custom hooks
- Use composition over inheritance
- Document complex logic with JSDoc comments
- Clean code: Remove unused imports and variables

### Accessibility
- Use semantic HTML elements
- Ensure all interactive elements have accessible labels
- Use appropriate ARIA attributes when needed
- Test with keyboard navigation
- Follow WCAG guidelines
