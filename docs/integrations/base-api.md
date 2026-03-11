# BaseApi (Axios)

The default integration — wraps [Axios](https://axios-http.com/) for standalone HTTP requests and automatically detects [CodeceptJS](https://codecept.io/) at runtime.

## Setup

No extra dependencies needed — Axios ships with flex-rest:

```ts
import BaseApi from 'flex-rest'

const api = new BaseApi({
  token: 'your-bearer-token',
  baseUrl: 'https://api.example.com',
  timeout: 10000,
  retry: { count: 3, delay: 1000 },
  allowInsecureSSL: false,
  logFile: 'output/api_logs.txt'
})
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `token` | `string` | `undefined` | Bearer token for authentication |
| `baseUrl` | `string` | `''` | Prepended to relative URL paths |
| `timeout` | `number` | `undefined` | Request timeout in milliseconds |
| `retry` | `{ count, delay? }` | `undefined` | Retry failed requests (delay defaults to 1 000 ms) |
| `onRequest` | `RequestHook` | `undefined` | Hook called before each request |
| `onResponse` | `ResponseHook` | `undefined` | Hook called after each response |
| `allowInsecureSSL` | `boolean` | `false` | Accept self-signed SSL certificates |
| `logFile` | `string` | `undefined` | Path to write request/response logs |

## Usage

```ts
// GET
const users = await api.get<User[]>('/users')

// POST
const newUser = await api.post<User>('/users', {
  name: 'John',
  email: 'john@example.com'
})

// PUT
await api.put('/users/1', { name: 'Jane' })

// PATCH
await api.patch('/users/1', { name: 'Jane Doe' })

// DELETE
await api.delete('/users/1')

// HEAD
const head = await api.head('/users')
```

## Extending BaseApi

The recommended pattern — build typed API classes:

```ts
interface Product {
  id: number
  name: string
  price: number
}

class ProductApi extends BaseApi {
  constructor(baseUrl: string, token: string) {
    super({
      token,
      baseUrl,
      timeout: 10000,
      logFile: 'output/products.txt'
    })
  }

  async list() {
    return this.get<Product[]>('/products')
  }

  async getById(id: number) {
    return this.get<Product>(`/products/${id}`)
  }

  async create(data: Omit<Product, 'id'>) {
    return this.post<Product>('/products', data)
  }

  async update(id: number, data: Partial<Product>) {
    return this.put<Product>(`/products/${id}`, data)
  }

  async patch(id: number, data: Partial<Product>) {
    return this.patch<Product>(`/products/${id}`, data)
  }

  async remove(id: number) {
    return this.delete(`/products/${id}`)
  }
}

// Usage
const products = new ProductApi('https://api.example.com', 'token')
const all = await products.list()
const created = await products.create({ name: 'Widget', price: 9.99 })
```

## Request Logging

Enable file-based logging to capture every request and response:

```ts
const api = new BaseApi({
  token: 'your-token',
  logFile: 'output/api_debug.txt'
})

await api.get('https://api.example.com/users')
// Writes method, URL, headers, payload, and response to the log file
```

Each API class can have its own log file, keeping concerns separated.

## Insecure SSL

For local development with self-signed certificates:

```ts
const api = new BaseApi({
  allowInsecureSSL: true // skips certificate validation
})
```

::: warning
Never enable `allowInsecureSSL` in production or CI environments.
:::

## CodeceptJS Auto-Detection

When running inside a CodeceptJS test, BaseApi automatically uses CodeceptJS helpers (`I.sendGetRequest`, `I.sendPostRequest`, etc.) instead of Axios. No code changes needed.

See the [CodeceptJS integration](/integrations/codeceptjs) for details.
