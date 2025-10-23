import { Page } from '@playwright/test'

export class PostsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/posts')
  }

  heading() {
    return this.page.getByRole('heading', { level: 1, name: /posts/i })
  }

  searchInput() {
    return this.page.getByLabel(/search posts by title/i)
  }

  resetButton() {
    return this.page.getByLabel(/clear search filter/i)
  }

  postLinks() {
    return this.page.getByRole('heading', { level: 2 })
  }

  async searchPosts(query: string) {
    await this.searchInput().type(query)
  }

  async clearSearch() {
    await this.resetButton().click()
  }
}
