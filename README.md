# flex-rest

Unified REST API client for **Axios**, **CodeceptJS**, **Playwright**, and **Supertest** — write your API layer once, test everywhere.

[![npm version](https://img.shields.io/npm/v/flex-rest.svg)](https://www.npmjs.com/package/flex-rest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why flex-rest?

Every testing framework has its own HTTP interface with a different response shape, header handling, and patterns. flex-rest wraps each one behind a **unified `HttpResponse<T>`** so your API layer, assertions, and helpers stay the same regardless of the framework.

```
┌─────────────────────────────────────────────┐
│              Your API Layer                  │
│   getUsers(), createOrder(), authenticate() │
└──────────────────┬──────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │   HttpResponse<T> │  ← unified contract
         └─────────┬─────────┘
                   │
    ┌──────────┬───┴───┬────────────┐
    │          │       │            │
 BaseApi  Playwright Supertest  CodeceptJS
 (Axios)     Api       Api     (auto-detected)
```

## Installation

```bash
npm install flex-rest
```

## Quick Start

### BaseApi (Axios)

The default integration — works standalone or auto-detects CodeceptJS at runtime:

```typescript
import BaseApi from 'flex-rest';

const api = new BaseApi({
  token: 'your-bearer-token',
  baseUrl: 'https://api.example.com',
  timeout: 10000,
  retry: { count: 3, delay: 1000 },
  allowInsecureSSL: false,
  logFile: 'output/api_logs.txt',
  onRequest: (method, url) => console.log(`→ ${method} ${url}`),
  onResponse: (method, url, res) => console.log(`← ${res.status} ${url}`)
});

const users = await api.get<User[]>('/users');
const created = await api.post<User>('/users', { name: 'John' });
await api.put('/users/1', { name: 'Jane' });
await api.patch('/users/1', { name: 'Jane Doe' });
await api.delete('/users/1');
```

### PlaywrightApi

Wraps Playwright's `APIRequestContext` for API testing alongside browser tests:

```typescript
import { PlaywrightApi } from 'flex-rest';
import { request } from '@playwright/test';

const context = await request.newContext();
const api = new PlaywrightApi(context, 'your-bearer-token');

const users = await api.get<User[]>('https://api.example.com/users');
const created = await api.post<User>('https://api.example.com/users', { name: 'John' });
await api.put('https://api.example.com/users/1', { name: 'Jane' });
await api.patch('https://api.example.com/users/1', { name: 'Jane Doe' });
await api.delete('https://api.example.com/users/1');
const head = await api.head('https://api.example.com/users');
```

### SupertestApi

Wraps [Supertest](https://github.com/ladjs/supertest) for testing Express/Koa/Fastify apps in-process — no running server needed:

```typescript
import { SupertestApi } from 'flex-rest';
import supertest from 'supertest';
import app from './app';

const api = new SupertestApi(supertest(app), 'your-bearer-token');

const users = await api.get<User[]>('/users');
const created = await api.post<User>('/users', { name: 'John' });
await api.put('/users/1', { name: 'Jane' });
await api.patch('/users/1', { name: 'Jane Doe' });
await api.delete('/users/1');
```

### CodeceptJS

BaseApi automatically detects the CodeceptJS context — no additional setup needed:

```typescript
import BaseApi from 'flex-rest';

// In your CodeceptJS test — uses I.sendGetRequest() automatically
Scenario('test API', async ({ I }) => {
  const api = new BaseApi({ token: 'test-token' });
  const response = await api.get('https://api.example.com/users');
});
```

## Extending BaseApi

Build typed, reusable API classes:

```typescript
import BaseApi from 'flex-rest';

interface User {
  id: number;
  name: string;
  email: string;
}

class UserApi extends BaseApi {
  constructor(token: string) {
    super({
      token,
      baseUrl: 'https://api.example.com',
      timeout: 10000,
      logFile: 'output/user_api.txt'
    });
  }

  async getUsers() {
    return this.get<User[]>('/users');
  }

  async createUser(data: { name: string; email: string }) {
    return this.post<User>('/users', data);
  }

  async updateUser(id: number, data: Partial<User>) {
    return this.put<User>(`/users/${id}`, data);
  }

  async patchUser(id: number, data: Partial<User>) {
    return this.patch<User>(`/users/${id}`, data);
  }

  async deleteUser(id: number) {
    return this.delete(`/users/${id}`);
  }
}

const api = new UserApi('your-token');
const { data: users } = await api.getUsers();
```

## API Reference

### Integrations

| Class | Wraps | Install |
|-------|-------|---------|
| `BaseApi` | Axios / CodeceptJS | Included |
| `PlaywrightApi` | `@playwright/test` | `npm i -D @playwright/test` |
| `SupertestApi` | `supertest` | `npm i -D supertest @types/supertest` |

### BaseApi Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `token` | `string` | `undefined` | Bearer token for authentication |
| `baseUrl` | `string` | `''` | Base URL prepended to relative paths |
| `timeout` | `number` | `undefined` | Request timeout in milliseconds |
| `retry` | `{ count: number; delay?: number }` | `undefined` | Retry failed requests with backoff |
| `onRequest` | `RequestHook` | `undefined` | Hook called before each request |
| `onResponse` | `ResponseHook` | `undefined` | Hook called after each response |
| `allowInsecureSSL` | `boolean` | `false` | Accept self-signed certificates |
| `logFile` | `string` | `undefined` | File path for request/response logging |

### HTTP Methods

All integrations support:

```typescript
get<T>(url: string, headers?: object): Promise<HttpResponse<T>>
post<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>>
put<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>>
patch<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>>
delete<T>(url: string, headers?: object): Promise<HttpResponse<T>>
head<T>(url: string, headers?: object): Promise<HttpResponse<T>>
```

### Response Format

```typescript
interface HttpResponse<T = any> {
  status: number;
  data: T;
  headers?: Record<string, any>;
}
```

### Error Handling — FlexRestError

Any 5xx response automatically throws a `FlexRestError` with status, URL, and response data:

```typescript
import { FlexRestError } from 'flex-rest';

try {
  await api.get('/unstable-endpoint');
} catch (error) {
  if (error instanceof FlexRestError) {
    console.log(error.status); // 502
    console.log(error.url);    // https://api.example.com/unstable-endpoint
    console.log(error.data);   // { error: 'Bad Gateway' }
  }
}
```

### TypeScript Generics

```typescript
interface TokenResponse {
  access_token: string;
  expires_in: number;
}

const res = await api.post<TokenResponse>('/auth/token', credentials);
const token = res.data.access_token; // fully typed
```

## Documentation

Full documentation is available at the [VitePress docs site](https://kobenguyent.github.io/flex-rest/):

```bash
npm run docs:dev      # Start dev server
npm run docs:build    # Build static site
npm run docs:preview  # Preview built site
```

## Development

```bash
npm install
npm test
npm run build
```

## Publishing

1. Update version in `package.json`
2. Commit and push changes
3. Create a GitHub release with a tag (e.g., `v1.0.0`)
4. The package will be automatically published to npm

**Setup:** Add `NPM_TOKEN` secret to your GitHub repository settings with your npm access token.

## License

MIT
