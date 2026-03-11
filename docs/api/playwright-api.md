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

### put

```ts
put<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>>
```

### patch

```ts
patch<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>>
```

### delete

```ts
delete<T>(url: string, headers?: object): Promise<HttpResponse<T>>
```

### head

```ts
head<T>(url: string, headers?: object): Promise<HttpResponse<T>>
```

Returns an empty data object since HEAD responses have no body.

::: tip Safe JSON Parsing
`PlaywrightApi` uses safe JSON parsing — non-JSON or empty responses return `null` instead of throwing.
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
