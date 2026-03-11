# SupertestApi

REST client wrapping [Supertest](https://github.com/ladjs/supertest) for in-process server testing.

## Import

```ts
import { SupertestApi } from 'flex-rest'
```

## Constructor

```ts
new SupertestApi(agent: SuperTest<Test>, token?: string)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `agent` | `SuperTest<Test>` | From `supertest(app)` |
| `token` | `string` | Optional Bearer token |

## Methods

### get

```ts
get<T>(url: string, headers?: object): Promise<HttpResponse<T>>
```

### post

```ts
post<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>>
```

Sends `payload` via `.send()`. If `payload` is `undefined`, no body is sent.

### put

```ts
put<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>>
```

Sends `payload` via `.send()`. If `payload` is `undefined`, no body is sent.

### delete

```ts
delete<T>(url: string, headers?: object): Promise<HttpResponse<T>>
```

### head

```ts
head<T>(url: string, headers?: object): Promise<HttpResponse<T>>
```

Returns an empty `data` object (`{} as T`) since HEAD responses have no body.

## Header Handling

Headers are applied using Supertest's native `.set()` chaining:

```ts
// Internally:
// agent.get(url).set('Authorization', 'Bearer token').set('X-Custom', 'value')
```

This is idiomatic to Supertest — no header object merging needed.

## Example

```ts
import supertest from 'supertest'
import { SupertestApi } from 'flex-rest'
import app from './app'

const api = new SupertestApi(supertest(app), 'test-token')

// Full CRUD
const users = await api.get<User[]>('/users')
const created = await api.post<User>('/users', { name: 'John' })
await api.put('/users/1', { name: 'Jane' })
await api.delete('/users/1')
```
