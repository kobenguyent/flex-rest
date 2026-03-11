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
  allowInsecureSSL?: boolean
  logFile?: string
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `token` | `string` | `undefined` | Bearer token added to every request |
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
| `httpsAgent` | `https.Agent \| undefined` | Custom HTTPS agent for insecure SSL |
| `logFile` | `string \| undefined` | Log file path |

## Example

```ts
class OrderApi extends BaseApi {
  constructor(token: string) {
    super({ token, logFile: 'output/orders.txt' })
  }

  async getOrders() {
    return this.get<Order[]>('https://api.example.com/orders')
  }

  async createOrder(items: CartItem[]) {
    return this.post<Order>('https://api.example.com/orders', { items })
  }
}
```
