import { test, expect } from '../fixtures'
import { ContactPage } from './page-objects/ContactPage'

test.describe('Contact Page', () => {
  test('should display contact form', async ({ page }) => {
    const contact = new ContactPage(page)
    await contact.goto()
    
    await expect(contact.heading()).toBeVisible()
    await expect(contact.nameInput()).toBeVisible()
    await expect(contact.emailInput()).toBeVisible()
    await expect(contact.messageTextarea()).toBeVisible()
    await expect(contact.submitButton()).toBeVisible()
  })

  test('should validate form fields', async ({ page }) => {
    const contact = new ContactPage(page)
    await contact.goto()
    
    // Try to submit empty form
    await contact.submitForm()
    
    // Should show validation errors
    await expect(contact.nameInput()).toHaveAttribute('required')
    await expect(contact.emailInput()).toHaveAttribute('required')
    await expect(contact.messageTextarea()).toHaveAttribute('required')
  })

  test('should fill and submit form', async ({ page }) => {
    const contact = new ContactPage(page)
    await contact.goto()
    
    await contact.fillForm({
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message'
    })
    
    await expect(contact.nameInput()).toHaveValue('Test User')
    await expect(contact.emailInput()).toHaveValue('test@example.com')
    await expect(contact.messageTextarea()).toHaveValue('This is a test message')
  })

  test('should have no accessibility violations - idle state', async ({ page, makeAxeBuilder }) => {
    const contact = new ContactPage(page)
    await contact.goto()
    await expect(contact.heading()).toBeVisible()
    const results = await makeAxeBuilder().analyze()
    expect(results.violations).toEqual([])
  })

  test('should have no accessibility violations - error state', async ({ page, makeAxeBuilder }) => {
    await page.route('**/api/contact', route =>
      route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server error' }) })
    )
    const contact = new ContactPage(page)
    await contact.goto()
    await contact.fillForm({ name: 'Test', email: 'test@example.com', message: 'Hello' })
    await contact.submitForm()
    await expect(page.getByText(/failed/i)).toBeVisible()
    const results = await makeAxeBuilder().analyze()
    expect(results.violations).toEqual([])
  })
})
