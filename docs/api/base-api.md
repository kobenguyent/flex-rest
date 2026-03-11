# BaseApi

Default REST client wrapping Axios, with automatic CodeceptJS detection.

## Import

```ts
import BaseApi from 'flex-rest'
// or
import { BaseApi } from 'flex-rest'
```

## Constructor

```ts
new BaseApi(options?: BaseApiOptions)
```

### BaseApiOptions

```ts
interface BaseApiOptions {
  token?: string
  baseUrl?: string
  timeout?: number
  retry?: { count: number; delay?: number }
  onRequest?: RequestHook
  onResponse?: ResponseHook
  allowInsecureSSL?: boolean
  logFile?: string
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `token` | `string` | `undefined` | Bearer token added to every request |
| `baseUrl` | `string` | `''` | Prepended to relative URL paths |
| `timeout` | `number` | `undefined` | Request timeout in milliseconds |
| `retry` | `{ count, delay? }` | `undefined` | Retry failed requests (`delay` defaults to 1 000 ms) |
| `onRequest` | `RequestHook` | `undefined` | Called before each request |
| `onResponse` | `ResponseHook` | `undefined` | Called after each response |
| `allowInsecureSSL` | `boolean` | `false` | Disables SSL certificate verification |
| `logFile` | `string` | `undefined` | File path for request/response logging |

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

## Protected Properties

When extending `BaseApi`, these properties are accessible:

| Property | Type | Description |
|----------|------|-------------|
| `token` | `string \| undefined` | The Bearer token (mutable) |
| `baseUrl` | `string` | Resolved base URL |
| `timeout` | `number \| undefined` | Request timeout |
| `retryCount` | `number` | Number of retries (0 = no retry) |
| `retryDelay` | `number` | Milliseconds between retries |
| `onRequest` | `RequestHook \| undefined` | Pre-request hook |
| `onResponse` | `ResponseHook \| undefined` | Post-response hook |
| `httpsAgent` | `https.Agent \| undefined` | Custom HTTPS agent for insecure SSL |
| `logFile` | `string \| undefined` | Log file path |

## Example

```ts
class OrderApi extends BaseApi {
  constructor(token: string) {
    super({
      token,
      baseUrl: 'https://api.example.com',
      timeout: 10000,
      retry: { count: 2, delay: 500 },
      logFile: 'output/orders.txt'
    })
  }

  async getOrders() {
    return this.get<Order[]>('/orders')
  }

  async createOrder(items: CartItem[]) {
    return this.post<Order>('/orders', { items })
  }

  async patchOrder(id: number, data: Partial<Order>) {
    return this.patch<Order>(`/orders/${id}`, data)
  }
}
```
