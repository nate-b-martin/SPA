# AGENTS.md

## Agent Orchestration

This agent acts as an orchestrator, delegating specialized tasks to domain-specific agents:

- **Frontend tasks**: Use APP-AGENT.md guidelines for Next.js App Router development
- **Component tasks**: Follow component patterns in components/ directory
- **Testing tasks**: Use Playwright E2E patterns from testing-instructions.mdc
- **Content tasks**: Follow MDX structure in content/ directory

## Commands
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Test**: `npm run test` (Playwright E2E)
- **Single test**: `npx playwright test filename.spec.ts`
- **Test UI**: `npm run test:ui`
- **Dev**: `npm run dev`

## Code Style Guidelines

### Imports & Formatting
- Use absolute imports: `import Component from '@/components/ui/button'`
- Follow Prettier config: single quotes, no semicolons, 2-space tabs
- Use Tailwind CSS for all styling (no inline styles)

### TypeScript & Types
- All components must be typed with TypeScript
- Use explicit types for props and state
- Strict mode enabled in tsconfig.json

### Naming Conventions
- Components: PascalCase (e.g., `Button`, `Header`)
- Files: kebab-case (e.g., `button.tsx`, `header.tsx`)
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE

### React & Next.js
- Use functional components with hooks only
- Follow App Router structure
- Use `async` components for data fetching
- Place reusable components in `components/` directory

### Error Handling
- Use error boundaries for component errors
- Handle async errors with try/catch
- Provide user-friendly error messages

### Testing
- Use Playwright for E2E tests
- Follow Page Object Model pattern
- Test accessibility and responsive design
- All tests must be deterministic and independent

### Security
- Never hardcode secrets or API keys
- Validate all user inputs
- Use environment variables for configuration