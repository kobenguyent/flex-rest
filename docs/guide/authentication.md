# Authentication

All flex-rest integrations support **Bearer token authentication** out of the box via a constructor parameter.

## Setting a Token

::: code-group

```ts [BaseApi]
const api = new BaseApi({
  token: 'your-bearer-token'
})
```

```ts [PlaywrightApi]
const api = new PlaywrightApi(requestContext, 'your-bearer-token')
```

```ts [SupertestApi]
const api = new SupertestApi(agent, 'your-bearer-token')
```

:::

The token is automatically injected as an `Authorization: Bearer <token>` header on every request.

## Custom Headers

You can pass additional headers on any request. They merge with the auth header:

```ts
const res = await api.get('/users', {
  'X-Custom-Header': 'custom-value',
  'Accept-Language': 'en-US'
})
// Sends: Authorization: Bearer <token>
//        X-Custom-Header: custom-value
//        Accept-Language: en-US
```

## Dynamic Tokens

For APIs that require token refresh, create a helper:

```ts
class AuthenticatedApi extends BaseApi {
  private baseUrl: string

  constructor(baseUrl: string) {
    super()
    this.baseUrl = baseUrl
  }

  async authenticate(credentials: { username: string; password: string }) {
    const res = await this.post<{ access_token: string }>(
      `${this.baseUrl}/auth/token`,
      credentials
    )
    this.token = res.data.access_token
    return this
  }
}

// Usage
const api = new AuthenticatedApi('https://api.example.com')
await api.authenticate({ username: 'admin', password: 'secret' })
const users = await api.get('/users') // token is now set
```

## Without Authentication

Simply omit the token — no auth header is added:

```ts
const api = new BaseApi() // no token
const api = new PlaywrightApi(context) // no token
const api = new SupertestApi(agent) // no token
```
