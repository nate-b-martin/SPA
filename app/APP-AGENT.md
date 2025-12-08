# APP-AGENT.md

## Next.js App Router Agent Guidelines

### Directory Structure
- `app/` - Next.js App Router root
- `app/layout.tsx` - Root layout wrapper
- `app/page.tsx` - Homepage route
- `app/[route]/page.tsx` - Dynamic route pages
- `app/[route]/[slug]/page.tsx` - Nested dynamic routes

### Route Development
- Each folder = route segment
- `page.tsx` files are route components
- Use `async` components for data fetching
- Place static assets in `app/` (fonts, favicon)

### Layout Architecture
- Root layout in `app/layout.tsx` wraps all pages
- Use `<html>` and `<body>` tags with theme providers
- Import global CSS: `import './globals.css'`
- Add metadata and viewport configuration

### Page Component Patterns
```tsx
export default async function PageName() {
  // Data fetching here
  return (
    <section className='pb-24 pt-40'>
      <div className='container max-w-3xl'>
        {/* Page content */}
      </div>
    </section>
  )
}
```

### Dynamic Routes
- Use `[slug]` folders for dynamic segments
- Access params: `const { slug } = await params`
- Generate static params with `generateStaticParams()`
- Handle 404s with `notFound()`

### Styling Standards
- Use Tailwind utility classes only
- Follow section pattern: `className='pb-24 pt-40'`
- Container pattern: `className='container max-w-3xl'`
- Title pattern: `className='title'`

### Data Fetching
- Import data functions from `@/lib/`
- Use async/await for all data operations
- Handle errors gracefully
- Type all props and return values

### Component Imports
- Use absolute imports: `@/components/component-name`
- Import UI components: `@/components/ui/button`
- Import lib functions: `@/lib/posts`
- Import utilities: `@/lib/utils`

### Metadata & SEO
- Add metadata to layouts and pages
- Use proper title hierarchy
- Include Open Graph images
- Set proper descriptions

### Font Management
- Place font files in `app/fonts/`
- Import in `layout.tsx` with `next/font`
- Use Geist family for consistency