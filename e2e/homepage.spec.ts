import { test, expect } from '@playwright/test'
import { HomePage } from './page-objects/HomePage'

test.describe('Homepage', () => {
  test('should render header and intro section', async ({ page }) => {
    const home = new HomePage(page)
    await home.goto()
    
    await expect(home.banner()).toBeVisible()
    await expect(home.heading()).toHaveText(/Hey, I'm Nathan Martin/i)
  })

  test('should have working navigation links', async ({ page }) => {
    const home = new HomePage(page)
    await home.goto()
    
    await expect(home.postsLink()).toBeVisible()
    await expect(home.projectsLink()).toBeVisible()
    await expect(home.contactLink()).toBeVisible()
    
    await home.postsLink().click()
    await expect(page).toHaveURL('/posts')
  })

  test('should switch between dark and light theme', async ({ page }) => {
    const home = new HomePage(page)
    await home.goto()
    
    const themeToggle = home.themeToggle()
    await expect(themeToggle).toBeVisible()
    
    // Test theme switching
    await themeToggle.click()
    await expect(page.locator('html')).toHaveAttribute('class', /dark/)
    
    await themeToggle.click()
    await expect(page.locator('html')).not.toHaveAttribute('class', /dark/)
  })

  test('should display recent posts section', async ({ page }) => {
    const home = new HomePage(page)
    await home.goto()
    
    await expect(home.recentPostsSection()).toBeVisible()
  })
})
