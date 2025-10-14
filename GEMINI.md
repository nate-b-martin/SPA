# Gemini Project Context: Portfolio Website

## Project Overview

This is a modern, responsive portfolio website for a Tech Consultant. It is built using Next.js 15 (with the App Router), TypeScript, and styled with Tailwind CSS. The project serves as a personal showcase, featuring a blog system, a project gallery, and support for both dark and light themes.

Content is managed through MDX files, allowing for a mix of Markdown and React components. This enables rich, dynamic content for blog posts and project descriptions. The site is optimized for performance using Static Site Generation (SSG).

**Key Technologies:**
- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Content:** MDX (`next-mdx-remote`)
- **UI:** Radix UI, Lucide React
- **Testing:** Playwright for end-to-end tests

## Building and Running

The project uses `npm` for package management.

- **Install Dependencies:**
  ```bash
  npm install
  ```

- **Run Development Server:**
  Starts the development server on `http://localhost:3000`.
  ```bash
  npm run dev
  ```

- **Build for Production:**
  Creates an optimized production build.
  ```bash
  npm run build
  ```

- **Start Production Server:**
  Runs the production build.
  ```bash
  npm run start
  ```

- **Run Tests:**
  Executes the end-to-end tests using Playwright.
  ```bash
  npm run test
  ```

- **Linting:**
  Runs ESLint to check for code quality and style issues.
  ```bash
  npm run lint
  ```

## Development Conventions

- **Styling:** Styling is handled by Tailwind CSS. Utility classes are the primary method for styling components. The configuration can be found in `tailwind.config.ts`. The project also uses `clsx` and `tailwind-merge` for conditional and optimized class name management.

- **Component Structure:** The project follows a standard React component architecture. Reusable components are located in the `components/` directory. More primitive, reusable UI elements (like buttons and inputs) are in `components/ui/`.

- **Content Management:** All user-facing content (blog posts and projects) is stored in the `content/` directory as `.mdx` files.
  - To add a new blog post, create a new `.mdx` file in `content/posts/`.
  - To add a new project, create a new `.mdx` file in `content/projects/`.
  - Each content file must include a YAML frontmatter block with metadata such as `title`, `summary`, `image`, `author`, and `publishedAt`.

- **Testing:** End-to-end testing is implemented with Playwright. Test specifications are located in the `e2e/` directory, with page objects in `e2e/page-objects/` to promote reusable test logic.

- **Continuous Integration:** The repository is configured with a GitHub Actions workflow (`.github/workflows/playwright.yml`) that automatically runs the Playwright test suite on pushes and pull requests, ensuring code quality and application stability.
