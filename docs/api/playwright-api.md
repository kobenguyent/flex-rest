# PlaywrightApi

REST client wrapping Playwright's `APIRequestContext`.

## Import

```ts
import { PlaywrightApi } from 'flex-rest'
```

## Constructor

```ts
new PlaywrightApi(request: APIRequestContext, token?: string)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `request` | `APIRequestContext` | From `@playwright/test` |
| `token` | `string` | Optional Bearer token |

## Methods

### get

```ts
get<T>(url: string, headers?: object): Promise<HttpResponse<T>>
```

### post

```ts
post<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>>
```

::: info
`put`, `delete`, and `head` methods can be added following the same wrapping pattern. Currently only `get` and `post` are implemented.
:::

## Example

```ts
import { test, expect } from '@playwright/test'
import { PlaywrightApi } from 'flex-rest'

test('API test', async ({ request }) => {
  const api = new PlaywrightApi(request, 'my-token')

  const res = await api.get<User[]>('/api/users')
  expect(res.status).toBe(200)
  expect(res.data.length).toBeGreaterThan(0)
})
```
