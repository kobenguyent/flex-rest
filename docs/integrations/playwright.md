# Playwright

Wraps Playwright's [`APIRequestContext`](https://playwright.dev/docs/api/class-apirequestcontext) for API testing alongside browser tests.

## Prerequisites

```sh
npm install --save-dev @playwright/test
```

## Setup

```ts
import { PlaywrightApi } from 'flex-rest'
import { request } from '@playwright/test'

const context = await request.newContext()
const api = new PlaywrightApi(context, 'your-bearer-token')
```

## Constructor

```ts
new PlaywrightApi(request: APIRequestContext, token?: string)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `request` | `APIRequestContext` | Playwright's API request context |
| `token` | `string` | Optional Bearer token |

## Usage

```ts
// GET
const users = await api.get<User[]>('https://api.example.com/users')

// POST
const user = await api.post<User>('https://api.example.com/users', {
  name: 'John',
  email: 'john@example.com'
})
```

## In Playwright Tests

Use within `test()` blocks with Playwright's built-in fixtures:

```ts
import { test, expect } from '@playwright/test'
import { PlaywrightApi } from 'flex-rest'

test('should create and fetch a user', async ({ request }) => {
  const api = new PlaywrightApi(request, process.env.API_TOKEN)

  // Create
  const created = await api.post<User>('/api/users', {
    name: 'Test User',
    email: 'test@example.com'
  })
  expect(created.status).toBe(201)

  // Verify
  const fetched = await api.get<User>(`/api/users/${created.data.id}`)
  expect(fetched.data.name).toBe('Test User')
})
```

## Custom Fixture

Create a reusable Playwright fixture:

```ts
// fixtures.ts
import { test as base } from '@playwright/test'
import { PlaywrightApi } from 'flex-rest'

interface ApiFixtures {
  api: PlaywrightApi
}

export const test = base.extend<ApiFixtures>({
  api: async ({ request }, use) => {
    const api = new PlaywrightApi(request, process.env.API_TOKEN)
    await use(api)
  }
})

export { expect } from '@playwright/test'
```

```ts
// user.spec.ts
import { test, expect } from './fixtures'

test('list users', async ({ api }) => {
  const res = await api.get<User[]>('/api/users')
  expect(res.status).toBe(200)
  expect(res.data.length).toBeGreaterThan(0)
})
```

## Supported Methods

| Method | Available |
|--------|-----------|
| `get` | ✅ |
| `post` | ✅ |
| `put` | ✅ |
| `patch` | ✅ |
| `delete` | ✅ |
| `head` | ✅ |

::: tip Safe JSON Parsing
`PlaywrightApi` uses safe JSON parsing — non-JSON or empty response bodies return `null` instead of throwing an error.
:::
