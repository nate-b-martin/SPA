import { test, expect } from '../../fixtures'

/**
 * API-level tests for the contact form endpoint.
 *
 * Uses Playwright's `page.request` (APIRequestContext) to send direct HTTP
 * requests to `/api/contact` without loading any page UI. This keeps tests
 * fast and focused on server-side validation logic.
 *
 * Input validation (missing fields, invalid email) requires no mocking — the
 * route handler returns 400 before any external dependency is called. The
 * success test exercises the full stack including the Resend SDK; a valid
 * `RESEND_API_KEY` environment variable is expected to be present.
 */
test.describe('Contact API', () => {
  test('POST /api/contact with valid data returns success', async ({ page }) => {
    await page.route('**/resend.dev/**', route => route.fulfill({ status: 200 }))

    const response = await page.request.post('/api/contact', {
      data: { name: 'Test', email: 'test@example.com', message: 'Hello' }
    })
    expect(response.status()).toBe(200)
    expect(await response.json()).toEqual({ success: true })
  })

  test('POST /api/contact when Resend fails returns 500', async ({ page }) => {
    await page.route('**/resend.dev/**', route => route.abort('connectionfailed'))

    const response = await page.request.post('/api/contact', {
      data: { name: 'Test', email: 'test@example.com', message: 'Hello' }
    })
    expect(response.status()).toBe(500)
    expect(await response.json()).toEqual({ error: 'Failed to send message' })
  })

  test('POST /api/contact with missing fields returns 400', async ({ page }) => {
    const response = await page.request.post('/api/contact', {
      data: { name: '', email: '', message: '' }
    })
    expect(response.status()).toBe(400)
    expect(await response.json()).toEqual({ error: 'All fields are required' })
  })

  test('POST /api/contact with invalid email returns 400', async ({ page }) => {
    const response = await page.request.post('/api/contact', {
      data: { name: 'Test', email: 'not-an-email', message: 'Hello' }
    })
    expect(response.status()).toBe(400)
    expect(await response.json()).toEqual({ error: 'Invalid email address' })
  })
})
