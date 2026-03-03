# Project Improvement Plan

**Created:** 2026-02-04  
**Updated:** 2026-02-24  
**Project:** Nathan Martin Portfolio

---

## 🔴 Critical Issues (Fix Immediately)

### Security
- [x] **Add Security Headers Middleware** ✅ COMPLETED
  - Created `middleware.ts` with CSP, X-Frame-Options, HSTS
  - Configured referrer-policy and permissions-policy
  - Build successful (32.3 kB middleware)

- [x] **Sanitize MDX Content Rendering** ✅ COMPLETED
  - Audited `components/mdx-content.tsx` usage of `dangerouslySetInnerHTML`
  - Added `isomorphic-dompurify` for SSR-compatible sanitization
  - Used restrictive config: only allows span/code tags and class attributes
  - Build successful: All posts render correctly

- [x] **Implement Contact Form Rate Limiting** ✅ COMPLETED
  - Created API route at `app/api/contact/route.ts`
  - Configured Upstash Redis rate limiting (100/hour per IP)
  - Added server-side validation and Resend email integration
  - Build successful: API route 136 B

- [ ] **Strengthen Content Security Policy**
  - Remove `'unsafe-inline'` and `'unsafe-eval'` from CSP in middleware.ts
  - Use nonces or hashes for required inline scripts
  - Test CSP effectiveness with security scanners

- [ ] **Sanitize Email Template Content**
  - Add HTML sanitization to contact form email generation
  - Use DOMPurify or escape HTML special characters in email templates
  - Prevent potential email injection vulnerabilities

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
- [x] **Implement Contact Form Backend** ✅ COMPLETED
  - Created API route at `app/api/contact/route.ts`
  - Add form validation (server-side)
  - Integrated email service (Resend)
  - Added success/error feedback to users

- [ ] **Enhance Rate Limiting Strategy**
  - Improve rate limiting key to include user agent or session ID
  - Prevent legitimate users from being blocked due to shared IP addresses
  - Add different rate limits for different types of requests

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
- [ ] **Add Form Submission Debouncing**
  - Implement debouncing to prevent accidental double form submissions
  - Add visual feedback during debounce period
  - Test with various form submission patterns

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
6. **Strengthen CSP** - Remove unsafe directives from middleware.ts
7. **Sanitize email content** - Add HTML escaping to email templates

---

## 📊 Current Status

**Last Updated:** 2026-02-24  
**Code Review:** 2026-02-24 - Review completed, security improvements identified

| Category | Completed | In Progress | Pending |
|----------|-----------|-------------|---------|
| Security | 3 | 0 | 2 |
| Testing | 0 | 0 | 3 |
| Functionality | 1 | 0 | 1 |
| Design/UX | 0 | 0 | 6 |
| Performance | 0 | 0 | 5 |
| Code Quality | 0 | 0 | 4 |

**Total Items:** 31  
**Completed:** 4  
**Progress:** 13%

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
