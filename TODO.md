# Project Improvement Plan

**Created:** 2026-02-04  
**Project:** Nathan Martin Portfolio

---

## 🔴 Critical Issues (Fix Immediately)

### Security
- [ ] **Add Security Headers Middleware**
  - Create `middleware.ts` with CSP, X-Frame-Options, HSTS
  - Configure referrer-policy and permissions-policy
  - Test headers with security scanners

- [ ] **Sanitize MDX Content Rendering**
  - Audit `components/mdx-content.tsx` usage of `dangerouslySetInnerHTML`
  - Consider using DOMPurify if user-generated content is ever added
  - Document the security consideration

- [ ] **Implement Contact Form Rate Limiting**
  - Add rate limiting middleware or API route protection
  - Consider using Upstash Redis or similar for rate limiting
  - Prevent spam/abuse on contact form

### Testing
- [ ] **Enable GitHub Actions CI/CD**
  - Uncomment `.github/workflows/playwright.yml`
  - Add build and lint checks to workflow
  - Configure artifact retention and notifications

- [ ] **Add Unit Testing Framework**
  - Install and configure Vitest (recommended) or Jest
  - Add test utilities: React Testing Library, @testing-library/jest-dom
  - Write unit tests for utility functions (lib/utils.ts, lib/posts.ts, lib/experiences.ts)

- [ ] **Add Accessibility Testing**
  - Integrate @axe-core/playwright or jest-axe
  - Add accessibility tests to E2E suite
  - Test keyboard navigation and screen reader compatibility

### Functionality
- [ ] **Implement Contact Form Backend**
  - Create API route at `app/api/contact/route.ts`
  - Add form validation (server-side)
  - Integrate email service (Resend, SendGrid, or Nodemailer)
  - Add success/error feedback to users

- [ ] **Add Error & Loading Boundaries**
  - Create `app/error.tsx` for error handling
  - Create `app/loading.tsx` for loading states
  - Add route-specific error and loading files
  - Test error scenarios

---

## 🟡 Design & UX Improvements

### Core UX
- [ ] **Create Custom 404 Page**
  - Design and implement `app/not-found.tsx`
  - Add helpful navigation links
  - Match site design aesthetic

- [ ] **Add Loading Skeletons**
  - Create skeleton components for posts list
  - Add skeleton for experience entries
  - Implement in loading.tsx files

- [ ] **Add Toast/Notification System**
  - Install sonner or react-hot-toast
  - Add feedback for form submissions
  - Theme-aware notifications

### Content & SEO
- [ ] **Implement Dynamic SEO Metadata**
  - Add metadata to all pages (title, description, keywords)
  - Create dynamic metadata for blog posts
  - Add Open Graph tags for social sharing

- [ ] **Generate Sitemap.xml**
  - Create `app/sitemap.ts` for dynamic generation
  - Include all posts and experiences
  - Set proper change frequencies and priorities

- [ ] **Create Robots.txt**
  - Generate static or dynamic robots.txt
  - Allow/disallow appropriate paths
  - Add sitemap reference

- [ ] **Add RSS Feed**
  - Create `app/feed.xml/route.ts`
  - Include blog posts with full content
  - Add RSS link to head/metadata

---

## 🟢 Optimization Strategies

### Performance
- [ ] **Configure Static Export**
  - Add `output: 'export'` to next.config.ts
  - Configure `distDir` if needed
  - Test build and deployment

- [ ] **Implement ISR (Incremental Static Regeneration)**
  - Add revalidate option to dynamic routes
  - Configure for posts and experiences
  - Test content updates trigger rebuilds

- [ ] **Use next/image for All Images**
  - Audit all image usage
  - Replace `<img>` tags with Image component
  - Configure sizes and priority for LCP images

- [ ] **Add Bundle Analyzer**
  - Install @next/bundle-analyzer
  - Configure for production builds
  - Analyze and optimize bundle size

- [ ] **Implement Content Caching**
  - Use React.cache for MDX content
  - Configure unstable_cache for expensive operations
  - Add revalidation strategies

### Code Quality
- [ ] **Add Pre-commit Hooks**
  - Install husky and lint-staged
  - Configure to run lint and type-check
  - Add commit message linting (commitlint)

- [ ] **Set Up Conventional Commits**
  - Add @commitlint/config-conventional
  - Document commit message format
  - Enforce in CI/CD

- [ ] **Add Visual Regression Testing**
  - Configure Playwright screenshot testing
  - Set up visual diff comparison
  - Integrate into CI pipeline

### Analytics & Monitoring
- [ ] **Add Analytics Integration**
  - Consider Vercel Analytics, Plausible, or Fathom
  - Configure privacy-friendly tracking
  - Add to layout.tsx

- [ ] **Add Error Monitoring**
  - Consider Sentry or LogRocket
  - Track client and server errors
  - Configure source maps

---

## 📝 Documentation

- [ ] **Update README.md**
  - Document testing commands
  - Add deployment instructions
  - List all available scripts

- [ ] **Create CONTRIBUTING.md**
  - Document coding standards
  - Explain commit message format
  - Add PR template guidelines

- [ ] **Document Component Usage**
  - Create Storybook setup (optional)
  - Document component props and variants
  - Add usage examples

---

## 🎯 Quick Wins (High Value, Low Effort)

1. **Enable CI/CD** - Just uncomment the workflow file
2. **Add next/image** - Swap img tags for Image component
3. **Create error.tsx** - Simple error boundary page
4. **Add metadata** - Copy existing patterns to all pages
5. **Configure static export** - One line in next.config.ts

---

## 📊 Current Status

**Last Updated:** 2026-02-04

| Category | Completed | In Progress | Pending |
|----------|-----------|-------------|---------|
| Security | 0 | 0 | 3 |
| Testing | 0 | 0 | 3 |
| Functionality | 0 | 0 | 2 |
| Design/UX | 0 | 0 | 6 |
| Performance | 0 | 0 | 5 |
| Code Quality | 0 | 0 | 3 |

**Total Items:** 27  
**Completed:** 0  
**Progress:** 0%

---

## 🚀 Getting Started

1. Start with **Critical Issues** section
2. Focus on **Quick Wins** first for momentum
3. Create separate branches for each major task
4. Run tests before and after changes: `npm test`
5. Run lint check: `npm run lint`
6. Update this TODO as tasks are completed

---

**Note:** Mark tasks as complete by checking the boxes: `- [x]`
