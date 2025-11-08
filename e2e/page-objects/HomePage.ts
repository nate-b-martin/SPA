import { Page } from '@playwright/test'

export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/')
  }

  banner() {
    return this.page.getByRole('banner')
  }

  heading() {
    return this.page.getByRole('heading', { level: 1 })
  }

  themeToggle() {
    return this.page.getByLabel(/switch to .* theme/i)
  }

  recentPostsSection() {
    return this.page.getByRole('heading', { name: /recent posts/i })
  }

  postsLink() {
    return this.page.getByRole('link', { name: /all posts/i })
  }

  projectsLink() {
    return this.page.getByRole('link', { name: /projects/i })
  }

  contactLink() {
    return this.page.getByRole('link', { name: /contact/i })
  }
}
