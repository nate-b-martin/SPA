import { test, expect } from '@playwright/test'
import { ProjectsPage } from './page-objects/ProjectsPage'

test.describe('Projects Page', () => {
  test('should display projects grid', async ({ page }) => {
    const projects = new ProjectsPage(page)
    await projects.goto()
    
    await expect(projects.heading()).toBeVisible()
    
    // Should have project images
    const projectImages = projects.projectImages()
    await expect(projectImages.first()).toBeVisible()
  })

  test('should navigate to individual project', async ({ page }) => {
    const projects = new ProjectsPage(page)
    await projects.goto()
    
    const firstProject = projects.projectLinks().first()
    await firstProject.click()
    
    // Should be on a project detail page
    await expect(page).toHaveURL(/\/projects\/.+/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
