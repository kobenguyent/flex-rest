# TypeScript Support

flex-rest is written in TypeScript and provides first-class type safety through generics.

## Typed Responses

Pass a type parameter to any HTTP method to get a fully typed `data` field:

```ts
interface User {
  id: number
  name: string
  email: string
}

const res = await api.get<User[]>('/users')
// res.data is User[] ✓
// res.data[0].name — autocomplete works ✓

const single = await api.get<User>('/users/1')
// single.data.email — fully typed ✓
```

## Typed API Classes

Build type-safe API layers by extending `BaseApi`:

```ts
interface CreateUserPayload {
  name: string
  email: string
}

interface TokenResponse {
  access_token: string
  expires_in: number
  token_type: string
}

class UserApi extends BaseApi {
  async getUsers() {
    return this.get<User[]>('/users')
  }

  async createUser(data: CreateUserPayload) {
    return this.post<User>('/users', data)
    //                 ^^^^ response type
    //                        ^^^^ payload is typed
  }

  async authenticate(credentials: { username: string; password: string }) {
    const res = await this.post<TokenResponse>('/auth/token', credentials)
    return res.data.access_token // string ✓
  }
}
```

## HttpResponse Interface

The core response type:

```ts
interface HttpResponse<T = any> {
  status: number
  data: T
  headers?: Record<string, any>
}
```

When you don't specify `T`, it defaults to `any`.

## HttpClient Interface

All integrations conform to this contract:

```ts
interface HttpClient {
  get<T>(url: string, headers?: object): Promise<HttpResponse<T>>
  post<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>>
  put<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>>
  delete<T>(url: string, headers?: object): Promise<HttpResponse<T>>
  head<T>(url: string, headers?: object): Promise<HttpResponse<T>>
}
```

This means you can write framework-agnostic utility functions:

```ts
async function fetchPaginated<T>(
  client: HttpClient,
  url: string,
  pages: number
): Promise<T[]> {
  const results: T[] = []
  for (let page = 1; page <= pages; page++) {
    const res = await client.get<T[]>(`${url}?page=${page}`)
    results.push(...res.data)
  }
  return results
}

// Works with ANY integration
const users = await fetchPaginated<User>(api, '/users', 5)
```

## Importing Types

```ts
import type { HttpResponse, HttpClient } from 'flex-rest'
```
