# HttpResponse

The unified response type returned by every integration.

## Definition

```ts
interface HttpResponse<T = any> {
  status: number
  data: T
  headers?: Record<string, any>
}
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `status` | `number` | HTTP status code (e.g., `200`, `201`, `404`) |
| `data` | `T` | Parsed response body. Defaults to `any` if no type parameter is given |
| `headers` | `Record<string, any>` | Response headers (optional, varies by integration) |

### Type Parameter

`T` controls the type of `data`:

```ts
// Untyped — data is `any`
const res = await api.get('/users')
res.data // any

// Typed — data is `User[]`
const res = await api.get<User[]>('/users')
res.data // User[]
res.data[0].name // string ✓
```

---

## HttpClient {#httpclient}

The interface contract that all integrations follow.

```ts
interface HttpClient {
  get<T>(url: string, headers?: object): Promise<HttpResponse<T>>
  post<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>>
  put<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>>
  delete<T>(url: string, headers?: object): Promise<HttpResponse<T>>
  head<T>(url: string, headers?: object): Promise<HttpResponse<T>>
}
```

Use this type for framework-agnostic function parameters:

```ts
async function healthCheck(client: HttpClient, baseUrl: string) {
  const res = await client.get(`${baseUrl}/health`)
  return res.status === 200
}

// Works with any integration
await healthCheck(new BaseApi(), 'https://api.example.com')
await healthCheck(new SupertestApi(agent), '')
```
