import { Page } from '@playwright/test'

export class ExperiencesPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/experiences')
  }

  heading() {
    return this.page.getByRole('heading', { level: 1, name: /experiences/i })
  }

  projectLinks() {
    return this.page.locator('.grid > li > a')
  }

  projectImages() {
    return this.page.getByRole('img')
  }
}
