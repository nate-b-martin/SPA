# Request mocking with playwright-cli

Intercept, mock, modify, and block network requests during QA sessions.

## CLI route commands

```bash
# Mock with custom status
playwright-cli -s=qa route "**/*.jpg" --status=404

# Mock with JSON body
playwright-cli -s=qa route "**/api/contact" --body='{"ok":true}' --content-type=application/json

# Mock with custom headers
playwright-cli -s=qa route "**/api/data" --body='{"ok":true}' --header="X-Custom: value"

# Remove headers from requests
playwright-cli -s=qa route "**/*" --remove-header=cookie,authorization

# List active routes
playwright-cli -s=qa route-list

# Remove a route or all routes
playwright-cli -s=qa unroute "**/*.jpg"
playwright-cli -s=qa unroute
```

## URL patterns

```
**/api/contact           — Exact path match
**/api/*/details         — Wildcard in path
**/*.{png,jpg,jpeg}      — Match file extensions
**/search?q=*            — Match query parameters
```

## Advanced mocking with run-code

### Conditional response based on request body

```bash
playwright-cli -s=qa run-code "async page => {
  await page.route('**/api/login', route => {
    const body = route.request().postDataJSON()
    if (body.email === 'admin@example.com') {
      route.fulfill({ body: JSON.stringify({ token: 'mock-token' }) })
    } else {
      route.fulfill({ status: 401, body: JSON.stringify({ error: 'Invalid' }) })
    }
  })
}"
```

### Modify real response

```bash
playwright-cli -s=qa run-code "async page => {
  await page.route('**/api/user', async route => {
    const response = await route.fetch()
    const json = await response.json()
    json.isPremium = true
    await route.fulfill({ response, json })
  })
}"
```

### Simulate network failures

```bash
playwright-cli -s=qa run-code "async page => {
  await page.route('**/api/offline', route => route.abort('internetdisconnected'))
}"
```

Options: `connectionrefused`, `timedout`, `connectionreset`, `internetdisconnected`

### Delayed response (test loading states)

```bash
playwright-cli -s=qa run-code "async page => {
  await page.route('**/api/slow', async route => {
    await new Promise(r => setTimeout(r, 3000))
    route.fulfill({ body: JSON.stringify({ data: 'loaded' }) })
  })
}"
```

## Testing specific scenarios

### API error handling

```bash
playwright-cli -s=qa route "**/api/contact" --status=500 --body='{"error":"Server error"}'
playwright-cli -s=qa goto /contact
# Fill and submit — observe the error display
playwright-cli -s=qa snapshot
playwright-cli -s=qa unroute
```

### Empty data

```bash
playwright-cli -s=qa route "**/api/posts" --body='[]'
playwright-cli -s=qa goto /posts
playwright-cli -s=qa snapshot
playwright-cli -s=qa unroute
```

### Loading state test

```bash
playwright-cli -s=qa run-code "async page => { await page.route('**', async route => { await new Promise(r => setTimeout(r, 5000)); await route.continue(); }) }"
playwright-cli -s=qa goto /posts
playwright-cli -s=qa snapshot
```
