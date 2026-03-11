# Getting Started

## Installation

::: code-group

```sh [npm]
npm install flex-rest
```

```sh [pnpm]
pnpm add flex-rest
```

```sh [yarn]
yarn add flex-rest
```

:::

## Quick Start

### Using with Axios (default)

The simplest way to get started — no extra dependencies needed:

```ts
import BaseApi from 'flex-rest'

const api = new BaseApi({
  token: 'your-bearer-token'
})

const users = await api.get<User[]>('https://api.example.com/users')
console.log(users.status) // 200
console.log(users.data)   // User[]
```

### Using with Playwright

```ts
import { PlaywrightApi } from 'flex-rest'
import { request } from '@playwright/test'

const context = await request.newContext()
const api = new PlaywrightApi(context, 'your-bearer-token')

const users = await api.get<User[]>('https://api.example.com/users')
```

### Using with Supertest

```ts
import { SupertestApi } from 'flex-rest'
import supertest from 'supertest'
import app from './app' // your Express app

const agent = supertest(app)
const api = new SupertestApi(agent, 'your-bearer-token')

const users = await api.get<User[]>('/users')
```

### Using with CodeceptJS

BaseApi automatically detects the CodeceptJS context — no setup needed:

```ts
import BaseApi from 'flex-rest'

// Inside a CodeceptJS test, it uses I.sendGetRequest() automatically
const api = new BaseApi({ token: 'your-token' })
const users = await api.get<User[]>('https://api.example.com/users')
```

## Building an API Layer

The real power of flex-rest is building framework-agnostic API classes:

```ts
import BaseApi from 'flex-rest'

interface User {
  id: number
  name: string
  email: string
}

class UserApi extends BaseApi {
  private baseUrl = 'https://api.example.com'

  async getUsers() {
    return this.get<User[]>(`${this.baseUrl}/users`)
  }

  async getUser(id: number) {
    return this.get<User>(`${this.baseUrl}/users/${id}`)
  }

  async createUser(data: { name: string; email: string }) {
    return this.post<User>(`${this.baseUrl}/users`, data)
  }

  async updateUser(id: number, data: Partial<User>) {
    return this.put<User>(`${this.baseUrl}/users/${id}`, data)
  }

  async deleteUser(id: number) {
    return this.delete(`${this.baseUrl}/users/${id}`)
  }
}
```

This `UserApi` class works identically whether Axios or CodeceptJS is the underlying transport.

## What's Next?

- Learn about the [Unified Response](/guide/unified-response) format
- Set up [Authentication](/guide/authentication)
- Explore each [Integration](/integrations/base-api) in detail
