# Unified Response

Every method across all integrations returns the same `HttpResponse<T>` shape:

```ts
interface HttpResponse<T = any> {
  status: number
  data: T
  headers?: Record<string, any>
}
```

## Consistent Everywhere

No matter which integration you use, the response is identical:

::: code-group

```ts [Axios / BaseApi]
const api = new BaseApi({ token })
const res = await api.get<User[]>('/users')
// res.status  → 200
// res.data    → User[]
// res.headers → { 'content-type': 'application/json', ... }
```

```ts [Playwright]
const api = new PlaywrightApi(context, token)
const res = await api.get<User[]>('/users')
// res.status  → 200
// res.data    → User[]
```

```ts [Supertest]
const api = new SupertestApi(agent, token)
const res = await api.get<User[]>('/users')
// res.status  → 200
// res.data    → User[]
// res.headers → { 'content-type': 'application/json', ... }
```

:::

## Why This Matters

This means your assertion logic doesn't depend on the framework:

```ts
// This helper works with ANY integration
function assertSuccess<T>(res: HttpResponse<T>) {
  expect(res.status).toBeGreaterThanOrEqual(200)
  expect(res.status).toBeLessThan(300)
  return res.data
}

const users = assertSuccess(await api.getUsers())
```

## HTTP Methods

All integrations support the same five methods:

| Method | Signature |
|--------|-----------|
| `GET` | `get<T>(url, headers?)` |
| `POST` | `post<T>(url, payload?, headers?)` |
| `PUT` | `put<T>(url, payload?, headers?)` |
| `DELETE` | `delete<T>(url, headers?)` |
| `HEAD` | `head<T>(url, headers?)` |

Each returns `Promise<HttpResponse<T>>`.
