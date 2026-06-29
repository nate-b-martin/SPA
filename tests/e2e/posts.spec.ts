import { test, expect } from '../fixtures'
import { PostsPage } from './page-objects/PostsPage'

test.describe('Posts Page', () => {
  test('should display posts list', async ({ page }) => {
    const posts = new PostsPage(page)
    await posts.goto()
    
    await expect(posts.heading()).toBeVisible()
    await expect(posts.searchInput()).toBeVisible()
    
    // Should have at least one post
    const postLinks = posts.postLinks()
    await expect(postLinks.first()).toBeVisible()
  })

  test('should filter posts by search', async ({ page }) => {
    const posts = new PostsPage(page)
    await posts.goto()
    
    // Search for a specific post
    await posts.searchPosts('MDX')
    
    // Should show filtered results
    const postLinks = posts.postLinks()
    await expect(postLinks.first()).toBeVisible()
    
    // Clear search
    await posts.clearSearch()
    await expect(posts.searchInput()).toHaveValue('')
  })

  test('should navigate to individual post', async ({ page }) => {
    const posts = new PostsPage(page)
    await posts.goto()
    
    const firstPost = posts.postLinks().first()
    await firstPost.click()
    
    // Should be on a post detail page
    await expect(page).toHaveURL(/\/posts\/.+/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('should have no accessibility violations - pre-search', async ({ page, makeAxeBuilder }) => {
    const posts = new PostsPage(page)
    await posts.goto()
    await expect(posts.heading()).toBeVisible()
    const results = await makeAxeBuilder().analyze()
    expect(results.violations).toEqual([])
  })

  test('should have no accessibility violations - post-search', async ({ page, makeAxeBuilder }) => {
    const posts = new PostsPage(page)
    await posts.goto()
    await posts.searchPosts('MDX')
    await expect(posts.postLinks().first()).toBeVisible()
    const results = await makeAxeBuilder().analyze()
    expect(results.violations).toEqual([])
  })
})
