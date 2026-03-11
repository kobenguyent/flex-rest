# Error Handling

flex-rest provides automatic server error detection across all integrations.

## Automatic Server Error Throws

Any response with a status code **≥ 500** automatically throws an error:

```ts
try {
  const res = await api.get('https://api.example.com/unstable-endpoint')
} catch (error) {
  // Error: Server error 502 received from https://api.example.com/unstable-endpoint
  console.error(error.message)
}
```

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

## Retry Pattern

Combine with a retry utility for flaky endpoints:

```ts
async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(r => setTimeout(r, delay))
    }
  }
  throw new Error('Unreachable')
}

// Usage
const res = await withRetry(() => api.get('/flaky-endpoint'))
```
