# Supertest

Wraps [Supertest](https://github.com/ladjs/supertest) for testing Express, Koa, Fastify, and other Node.js HTTP servers **without starting a running server**.

## Prerequisites

```sh
npm install --save-dev supertest @types/supertest
```

## Setup

```ts
import { SupertestApi } from 'flex-rest'
import supertest from 'supertest'
import app from './app' // your Express/Koa/Fastify app

const agent = supertest(app)
const api = new SupertestApi(agent, 'your-bearer-token')
```

## Constructor

```ts
new SupertestApi(agent: SuperTest<Test>, token?: string)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `agent` | `SuperTest<Test>` | Supertest agent wrapping your app |
| `token` | `string` | Optional Bearer token |

## Usage

```ts
// GET
const users = await api.get<User[]>('/users')

// POST with payload
const user = await api.post<User>('/users', {
  name: 'John',
  email: 'john@example.com'
})

// PUT
await api.put('/users/1', { name: 'Jane' })

// DELETE
await api.delete('/users/1')

// HEAD
const head = await api.head('/users')
```

## With Jest

```ts
import supertest from 'supertest'
import { SupertestApi } from 'flex-rest'
import { createApp } from '../src/app'

describe('User API', () => {
  let api: SupertestApi

  beforeAll(() => {
    const app = createApp()
    api = new SupertestApi(supertest(app), 'test-token')
  })

  it('should list users', async () => {
    const res = await api.get<User[]>('/users')
    expect(res.status).toBe(200)
    expect(res.data).toBeInstanceOf(Array)
  })

  it('should create a user', async () => {
    const res = await api.post<User>('/users', {
      name: 'John',
      email: 'john@test.com'
    })
    expect(res.status).toBe(201)
    expect(res.data.name).toBe('John')
  })

  it('should return 404 for missing user', async () => {
    const res = await api.get('/users/999')
    expect(res.status).toBe(404)
  })
})
```

## With Vitest

```ts
import { describe, it, expect, beforeAll } from 'vitest'
import supertest from 'supertest'
import { SupertestApi } from 'flex-rest'
import app from '../src/app'

describe('Order API', () => {
  let api: SupertestApi

  beforeAll(() => {
    api = new SupertestApi(supertest(app))
  })

  it('creates an order', async () => {
    const res = await api.post<Order>('/orders', {
      product: 'Widget',
      quantity: 3
    })
    expect(res.status).toBe(201)
    expect(res.data.product).toBe('Widget')
  })
})
```

## Custom Headers

Pass extra headers on any request — they merge with the auth token:

```ts
const res = await api.get('/users', {
  'Accept-Language': 'de-DE',
  'X-Request-Id': 'abc-123'
})
```

## Why Supertest?

Unlike Axios or Playwright, Supertest binds directly to your app's `http.Server` instance — no need to start a server on a port. This means:

- ⚡ **Faster tests** — no network overhead
- 🔒 **No port conflicts** — tests run in-process
- 🧹 **Cleaner CI** — no server lifecycle management
