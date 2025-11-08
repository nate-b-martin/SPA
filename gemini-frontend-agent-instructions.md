
# Gemini Frontend Agent Instructions

### Tell me when you are using this frontend agent
This document provides guidelines and best practices for modifying the frontend of this portfolio website. Adhering to these instructions will ensure code quality, consistency, and maintainability.

## 1. Project Overview

- **Framework:** [Next.js 15](https://nextjs.org/) (with App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) and custom components.
- **Content:** MDX (`next-mdx-remote`)

## 2. Core Principles

- **Consistency:** Follow the existing code style, naming conventions, and project structure.
- **Component-Based Architecture:** Build UIs using small, reusable, and well-defined components.
- **Accessibility (a11y):** Ensure all UI components are accessible to users with disabilities.
- **Performance:** Write efficient code and be mindful of performance implications.

## 3. Component Structure

- **Reusable Components:** Place general-purpose, reusable components in the `components/` directory.
- **UI Primitives:** More primitive, reusable UI elements (like `Button`, `Input`, etc.) are located in `components/ui/`. These are often built on top of Radix UI primitives.
- **Page-Specific Components:** If a component is only used on a single page, it can be co-located with that page's route file.

When creating a new component:
1.  Create a new file with a descriptive name (e.g., `user-profile.tsx`).
2.  Use TypeScript for props and state.
3.  Keep components focused on a single responsibility.

## 4. Styling

- **Tailwind CSS:** Use Tailwind's utility classes for all styling. Avoid writing custom CSS files unless absolutely necessary.
- **`clsx` and `tailwind-merge`:** Use the `cn` utility from `lib/utils.ts` for conditional and optimized class names.
- **Theme:** Adhere to the project's design system defined in `tailwind.config.ts`. Use theme values (e.g., `bg-primary`, `text-foreground`) instead of hardcoded colors.
- **Responsive Design:** Use Tailwind's responsive modifiers (e.g., `md:`, `lg:`) to ensure the UI is responsive across all screen sizes.

## 5. State Management

- **React Hooks:** For local component state, use React hooks like `useState` and `useReducer`.
- **Shared State:** For state that needs to be shared between components, use `useContext` or consider lifting state up to the nearest common ancestor.
- **Server State:** Data fetched from the server should be managed within the page or component that fetches it. There is no global server state management library in this project.

## 6. Data Fetching

- **Server Components:** Use `async/await` directly in React Server Components (RSCs) for data fetching.
- **`lib` directory:** Data fetching logic is centralized in the `lib/` directory (e.g., `lib/posts.ts`, `lib/experiences.ts`). Follow this pattern for new data fetching functions.

## 7. Routing

- **App Router:** The project uses the Next.js App Router.
- **File-based Routing:** Create new routes by adding new directories and `page.tsx` files within the `app/` directory.
- **Dynamic Routes:** Use bracket notation for dynamic routes (e.g., `app/posts/[slug]/page.tsx`).
- **`Link` Component:** Use the `next/link` component for client-side navigation.

## 8. TypeScript

- **Type Everything:** Use TypeScript for all new code. Provide types for props, state, and function arguments/return values.
- **`@/*` Alias:** Use the `@/*` path alias for imports to avoid long relative paths.

## 9. Accessibility (a11y)

- **Semantic HTML:** Use semantic HTML elements (`<nav>`, `<main>`, `<article>`, etc.) to structure your content.
- **ARIA Attributes:** Use ARIA attributes when necessary to provide additional information to assistive technologies.
- **Keyboard Navigation:** Ensure all interactive elements are focusable and operable with a keyboard.
- **Image Alt Text:** Provide descriptive alt text for all images.

## 10. Testing

- **Playwright:** The project uses Playwright for end-to-end testing.
- **Page Objects:** Use the Page Object Model (POM) to create reusable and maintainable tests. Page objects are located in `e2e/page-objects/`.
- **New Features:** When adding a new feature, add a corresponding Playwright test to ensure it works as expected.
- **Bug Fixes:** When fixing a bug, add a test that reproduces the bug to prevent regressions.

## 11. Code Quality

- **Linting:** Before committing code, run `npm run lint` to check for any linting errors.
- **Formatting:** Use a code formatter (like Prettier) to ensure consistent code formatting. The project has a `.prettierrc` file.

## 12. Dependencies

- **Check `package.json`:** Before adding a new dependency, check `package.json` to see if a similar library is already in use.
- **Use `npm`:** Use `npm install <package-name>` to add new dependencies.
- **Keep it Lean:** Only add dependencies that are absolutely necessary.
