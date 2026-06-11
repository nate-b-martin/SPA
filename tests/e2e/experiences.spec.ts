import { test, expect } from '@playwright/test'
import { ExperiencesPage } from './page-objects/ExperiencesPage'

test.describe('Experiences Page', () => {
  test('should display experiences grid', async ({ page }) => {
    const experiences = new ExperiencesPage(page)
    await experiences.goto()
    
    await expect(experiences.heading()).toBeVisible()
    
    // Should have experience images
    const experienceImages = experiences.projectImages()
    await expect(experienceImages.first()).toBeVisible()
  })

  test('should navigate to individual experience', async ({ page }) => {
    const experiences = new ExperiencesPage(page)
    await experiences.goto()
    
    const firstExperience = experiences.projectLinks().first()
    await firstExperience.click()
    
    // Should be on an experience detail page
    await expect(page).toHaveURL(/\/experiences\/.+/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
