# Running and debugging Playwright tests

## Running tests

```bash
# All tests (Chromium only, per npm script)
npm run test

# All projects (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari)
npx playwright test

# Single file
npx playwright test tests/e2e/homepage.spec.ts

# Single directory
npx playwright test tests/e2e/accessibility-tests/

# Single test by name
npx playwright test -g "should render"

# Single project
npx playwright test --project=chromium

# Headed mode
npx playwright test --headed

# UI mode
npm run test:ui
```

To avoid opening the HTML report automatically:

```bash
PLAYWRIGHT_HTML_OPEN=never npx playwright test
```

## Debugging failing tests

### 1. Run with --debug=cli

```bash
PLAYWRIGHT_HTML_OPEN=never npx playwright test tests/e2e/<file>.spec.ts:<line> --debug=cli
```

Run this in the background. Wait for output containing "Debugging Instructions" and a session name (e.g. `tw-abcdef`).

### 2. Attach playwright-cli

```bash
playwright-cli attach tw-abcdef
```

### 3. Navigate the paused test

The test is paused at the start. Use these commands:

```bash
playwright-cli resume                    # run to the end / next pause point
playwright-cli pause-at "page.goto"      # set a breakpoint
playwright-cli step-over                 # step one action
```

### 4. Diagnose the failure

```bash
playwright-cli snapshot                  # element structure
playwright-cli console error             # app-side errors
playwright-cli requests                  # network state
playwright-cli eval "document.title"     # page state
```

### 5. Generate the fix

Every playwright-cli action emits the equivalent Playwright TypeScript. Use it to:

- Update locators in the test
- Fix assertion values
- Add missing waits (never `page.waitForTimeout`)

### 6. Rerun

Stop the background test. Edit the test file. Rerun:

```bash
PLAYWRIGHT_HTML_OPEN=never npx playwright test tests/e2e/<file>.spec.ts --project=chromium
```

## Project-specific test commands

```bash
npm run test           # playwright test --project=chromium
npm run test:ui        # playwright test --ui
npm run test:headed    # playwright test --headed
npm run test:accessibility  # playwright test tests/e2e/accessibility-tests/accessibility.spec.ts
```

## Config reference

The project config at `playwright.config.ts` uses:

- **testDir**: `./tests/e2e`
- **baseURL**: `http://localhost:3000`
- **Projects**: chromium, firefox, webkit, Mobile Chrome (Pixel 5), Mobile Safari (iPhone 12)
- **webServer**: `npm run dev`, auto-starts, reuses existing server in dev
- **Retries**: 2 in CI, 0 locally
