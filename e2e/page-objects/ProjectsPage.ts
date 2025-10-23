import { Page } from '@playwright/test'

export class ProjectsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/projects')
  }

  heading() {
    return this.page.getByRole('heading', { level: 1, name: /projects/i })
  }

  projectLinks() {
    return this.page.locator('.grid > li > a')
  }

  projectImages() {
    return this.page.getByRole('img')
  }
}
