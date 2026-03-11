# Error Handling

flex-rest provides automatic server error detection and a custom `FlexRestError` class across all integrations.

## FlexRestError

Any response with status ≥ 500 throws a `FlexRestError` with structured properties:

```ts
import { FlexRestError } from 'flex-rest'

try {
  const res = await api.get('https://api.example.com/unstable-endpoint')
} catch (error) {
  if (error instanceof FlexRestError) {
    console.log(error.status) // 502
    console.log(error.url)    // https://api.example.com/unstable-endpoint
    console.log(error.data)   // { error: 'Bad Gateway' }
    console.log(error.name)   // 'FlexRestError'
  }
}
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `status` | `number` | HTTP status code (e.g., 500, 502, 503) |
| `url` | `string` | The URL that returned the error |
| `data` | `any` | Response body (if available) |
| `message` | `string` | `"Server error {status} received from {url}"` |
| `name` | `string` | Always `'FlexRestError'` |

This behavior is consistent across `BaseApi`, `PlaywrightApi`, and `SupertestApi`.

## Client Errors (4xx)

Client errors (400, 401, 403, 404, etc.) do **not** throw — they return normally so you can assert on them:

```ts
const res = await api.get('/users/nonexistent')
expect(res.status).toBe(404)
expect(res.data.message).toBe('User not found')
```

This is by design: client errors are often expected in tests (e.g., testing validation, auth failures), while 5xx errors indicate real problems.

## Custom Error Handling

Wrap your API class with additional error logic:

```ts
class RobustApi extends BaseApi {
  async safeGet<T>(url: string) {
    try {
      return await this.get<T>(url)
    } catch (error) {
      console.error(`Request failed: ${url}`, error)
      throw error
    }
  }
}
```

## Built-in Retry

`BaseApi` has built-in retry support — no external utility needed:

```ts
const api = new BaseApi({
  retry: { count: 3, delay: 1000 } // retry up to 3 times, 1s between attempts
})

// Automatically retries on network errors or exceptions
const res = await api.get('/flaky-endpoint')
```

::: tip
Retry kicks in on any thrown error (network failures, timeouts, etc.). Server errors (5xx) throw `FlexRestError` which also triggers retries.
:::
