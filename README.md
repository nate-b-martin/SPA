# Portfolio Project

A modern, responsive portfolio website built with Next.js 15, TypeScript, and Tailwind CSS. This project showcases Nathan Martin's work as a Tech Consultant, featuring a blog system, project gallery, and dark/light theme support.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15 with App Router, TypeScript, and Tailwind CSS
- **Content Management**: MDX-based blog posts and project showcases
- **Theme System**: Dark/light mode with system preference detection
- **Search Functionality**: Client-side search for blog posts
- **Responsive Design**: Mobile-first approach with flexible layouts
- **Static Generation**: Optimized performance with SSG
- **Syntax Highlighting**: Code blocks with Sugar High
- **Social Integration**: Footer with social media links

## 🛠️ Technology Stack

### Core Technologies
- **Next.js 15.0.3** (App Router)
- **React 18.3.1** with TypeScript
- **Tailwind CSS 3.4.1** for styling
- **MDX** for content management (`next-mdx-remote`)
- **Gray Matter** for frontmatter parsing

### UI & Design System
- **Radix UI** components for accessibility
- **Class Variance Authority** for component variants
- **Lucide React** for icons
- **Next Themes** for theme management
- **Sugar High** for syntax highlighting

### Typography
- **Inter** for sans-serif (body text)
- **Playfair Display** for serif (headings)
- **Geist fonts** available (commented out)

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx          # Homepage
│   ├── posts/            # Blog posts
│   └── projects/         # Project showcases
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── intro.tsx         # Personal introduction
│   ├── header.tsx        # Navigation header
│   ├── footer.tsx        # Footer with social links
│   └── ...               # Other components
├── content/              # MDX content
│   ├── posts/            # Blog posts
│   └── projects/         # Project showcases
├── lib/                  # Utility functions
│   ├── posts.ts          # Post management
│   ├── projects.ts       # Project management
│   └── utils.ts          # Helper functions
└── public/               # Static assets
    └── images/           # Images and assets
```

## 🎨 Design System

### Color Scheme
- **CSS Custom Properties** for light/dark themes
- **Semantic color tokens** (background, foreground, muted, etc.)
- **Consistent theming** across all components

### Components
- **Custom `.title` class** with underlined styling
- **Responsive grid layouts** for projects
- **Hover effects** and smooth transitions
- **Accessible form controls** with proper ARIA labels

## 📝 Content Management

### Blog Posts
- **MDX format** with frontmatter metadata
- **Automatic slug generation** from filenames
- **Search functionality** by title
- **Date formatting** and sorting

### Projects
- **Project showcases** with images and descriptions
- **Grid layout** with hover effects
- **Individual project pages** with full content

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio-project
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 Usage

### Adding New Posts
1. Create a new `.mdx` file in `content/posts/`
2. Add frontmatter with metadata:
```yaml
---
title: "Your Post Title"
summary: "Brief description"
image: "/path/to/image.jpg"
author: "Nathan Martin"
publishedAt: "2024-01-01"
---
```
3. Write your content in MDX format

### Adding New Projects
1. Create a new `.mdx` file in `content/projects/`
2. Add frontmatter with metadata:
```yaml
---
title: "Project Name"
summary: "Project description"
image: "/images/projects/project.jpg"
author: "Nathan Martin"
publishedAt: "2024-01-01"
---
```
3. Write your project details in MDX format

## 🎯 Current Content

### Posts (2 total)
- **"My First Post"** - About learning frontend frameworks
- **"Introduction to MDX"** - Technical content about MDX

### Projects (2 total)
- **"Ecommerce Store"** - Next.js + Stripe ecommerce project
- **"Next MDX Portfolio"** - This portfolio project itself

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy with one click

### Other Platforms
The project is configured for static site generation and can be deployed to:
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**
- **Any static hosting service**

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Features in Development
- **Hot reloading** with Next.js
- **TypeScript** for type safety
- **ESLint** for code quality
- **Tailwind CSS** for rapid styling

## 📋 Roadmap

### Planned Enhancements
- [ ] Contact page implementation
- [ ] Newsletter signup functionality
- [ ] Social media link updates
- [ ] Additional content (posts/projects)
- [ ] SEO optimization
- [ ] Performance improvements

## 🤝 Contributing

This is a personal portfolio project, but suggestions and improvements are welcome!

## 📄 License

This project is for personal use. Please respect the intellectual property.

---

Built with ❤️ by Nathan Martin
