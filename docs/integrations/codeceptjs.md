# CodeceptJS

`BaseApi` automatically detects and uses [CodeceptJS](https://codecept.io/) helpers at runtime. No separate class needed.

## How It Works

When running inside a CodeceptJS test, `BaseApi` detects the `inject()` context and routes all requests through CodeceptJS helpers:

| flex-rest method | CodeceptJS helper called |
|------------------|--------------------------|
| `api.get(url)` | `I.sendGetRequest(url, headers)` |
| `api.post(url, data)` | `I.sendPostRequest(url, data, headers)` |
| `api.put(url, data)` | `I.sendPutRequest(url, data, headers)` |
| `api.delete(url)` | `I.sendDeleteRequest(url, headers)` |
| `api.head(url)` | `I.sendHeadRequest(url, headers)` |

When **not** running in CodeceptJS, it falls back to Axios automatically.

## Setup

No extra configuration — just use `BaseApi`:

```ts
import BaseApi from 'flex-rest'

class UserApi extends BaseApi {
  async getUsers() {
    return this.get('https://api.example.com/users')
  }

  async createUser(name: string, email: string) {
    return this.post('https://api.example.com/users', { name, email })
  }
}
```

## In CodeceptJS Tests

```ts
// user_test.ts
Feature('User API')

Scenario('create and fetch user', async ({ I }) => {
  const api = new UserApi({ token: 'test-token' })

  const created = await api.createUser('John', 'john@example.com')
  assert.equal(created.status, 201)

  const users = await api.getUsers()
  assert.ok(users.data.length > 0)
})
```

## Dual-Mode Advantage

The same API class works in **both** CodeceptJS and standalone contexts:

```ts
// In CodeceptJS → uses I.sendGetRequest()
// In Jest/Vitest → uses axios.request()
// In a script    → uses axios.request()

const api = new UserApi({ token: 'my-token' })
const users = await api.getUsers() // works everywhere
```

This is particularly useful when you want to share API helpers across different test suites or use them in setup scripts.

## Prerequisites

Make sure your CodeceptJS config includes the REST helper:

```js
// codecept.conf.js
exports.config = {
  helpers: {
    REST: {
      endpoint: 'https://api.example.com',
      defaultHeaders: {
        'Content-Type': 'application/json'
      }
    }
  }
}
```
