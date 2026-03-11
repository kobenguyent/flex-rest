# BaseApi (Axios)

The default integration — wraps [Axios](https://axios-http.com/) for standalone HTTP requests and automatically detects [CodeceptJS](https://codecept.io/) at runtime.

## Setup

No extra dependencies needed — Axios ships with flex-rest:

```ts
import BaseApi from 'flex-rest'

const api = new BaseApi({
  token: 'your-bearer-token',
  allowInsecureSSL: false,
  logFile: 'output/api_logs.txt'
})
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `token` | `string` | `undefined` | Bearer token for authentication |
| `allowInsecureSSL` | `boolean` | `false` | Accept self-signed SSL certificates |
| `logFile` | `string` | `undefined` | Path to write request/response logs |

## Usage

```ts
// GET
const users = await api.get<User[]>('https://api.example.com/users')

// POST
const newUser = await api.post<User>('https://api.example.com/users', {
  name: 'John',
  email: 'john@example.com'
})

// PUT
await api.put('https://api.example.com/users/1', { name: 'Jane' })

// DELETE
await api.delete('https://api.example.com/users/1')

// HEAD
const head = await api.head('https://api.example.com/users')
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
  private baseUrl: string

  constructor(baseUrl: string, token: string) {
    super({ token, logFile: 'output/products.txt' })
    this.baseUrl = baseUrl
  }

  async list() {
    return this.get<Product[]>(`${this.baseUrl}/products`)
  }

  async getById(id: number) {
    return this.get<Product>(`${this.baseUrl}/products/${id}`)
  }

  async create(data: Omit<Product, 'id'>) {
    return this.post<Product>(`${this.baseUrl}/products`, data)
  }

  async update(id: number, data: Partial<Product>) {
    return this.put<Product>(`${this.baseUrl}/products/${id}`, data)
  }

  async remove(id: number) {
    return this.delete(`${this.baseUrl}/products/${id}`)
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
