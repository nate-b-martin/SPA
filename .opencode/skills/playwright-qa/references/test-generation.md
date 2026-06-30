# Test generation from playwright-cli interactions

Every playwright-cli action emits Playwright TypeScript code. Collect it to build test files.

## How it works

```bash
playwright-cli -s=qa open http://localhost:3000/login
playwright-cli -s=qa snapshot
# e1 [textbox "Email"], e2 [textbox "Password"], e3 [button "Sign In"]

playwright-cli -s=qa fill e1 "user@example.com"
# Ran Playwright code:
# await page.getByRole('textbox', { name: 'Email' }).fill('user@example.com');

playwright-cli -s=qa click e3
# Ran Playwright code:
# await page.getByRole('button', { name: 'Sign In' }).click();
```

## Building a test file

Collect generated code into a Playwright test:

```typescript
import { test, expect } from '@playwright/test'

test('login flow', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    await page.getByRole('textbox', { name: 'Email' }).fill('user@example.com')
    await page.getByRole('textbox', { name: 'Password' }).fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page).toHaveURL(/.*dashboard/)
})
```

## Adding assertions

Generated code captures actions but not assertions. Add expectations manually:

```typescript
// Basic visibility
await expect(page.getByRole('heading')).toBeVisible()
await expect(page.getByRole('alert', { name: 'Success' })).toBeVisible()

// Text content
await expect(page.getByTestId('header')).toHaveText('Welcome')
await expect(page.getByRole('button', { name: /submit/i })).toContainText(/save/i)

// Input values
await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('user@example.com')
await expect(page.getByRole('textbox', { name: 'Email' })).toBeEmpty()

// Checkbox/radio state
await expect(page.getByRole('checkbox', { name: 'Notify me' })).toBeChecked()

// URL
await expect(page).toHaveURL(/.*dashboard/)

// Aria snapshot (partial match — only capture what matters)
await expect(page).toMatchAriaSnapshot(`
  - heading "Welcome"
  - button "Sign out"
`)
```

Use playwright-cli to generate the locators and values for assertions:

```bash
# Stable locator for an element
playwright-cli --raw generate-locator e5

# Expected text content
playwright-cli --raw eval "el => el.textContent" e5

# Expected input value
playwright-cli --raw eval "el => el.value" e5

# Aria snapshot
playwright-cli --raw snapshot
playwright-cli --raw snapshot e5
```

## Best practices

### 1. Use semantic locators

Generated code uses role-based locators, which are more resilient:

```typescript
// Good — semantic, resilient
await page.getByRole('button', { name: 'Submit' }).click()

// Avoid — fragile CSS selectors
await page.locator('#submit-btn').click()
```

### 2. Explore before recording

Take a snapshot first to understand the page structure before interacting.

### 3. Prefer project conventions

For this project:
- Import from `../fixtures` when testing accessibility (provides `makeAxeBuilder`)
- Import from `@playwright/test` for basic feature tests
- Use Page Objects for reusable locators
- Place tests in `tests/e2e/`

### 4. Assertion locator rule

When asserting text content, ensure the locator doesn't contain text from the element itself. Prefer `getByTestId()` or `getByLabel()` for text assertions. When locator is text-based, use `toBeVisible()` instead of `toHaveText()`.
