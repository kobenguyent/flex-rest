# flex-rest

Bridge between Axios, CodeceptJS, and Playwright REST APIs with a unified interface.

## Installation

```bash
npm install flex-rest
```

## Usage

### BaseApi (Axios)

```typescript
import BaseApi from 'flex-rest';

const api = new BaseApi({
  token: 'your-bearer-token',
  allowInsecureSSL: false,
  logFile: 'output/api_logs.txt' // optional
});

const response = await api.get('https://api.example.com/users');
const user = await api.post('https://api.example.com/users', { name: 'John' });
await api.put('https://api.example.com/users/1', { name: 'Jane' });
await api.delete('https://api.example.com/users/1');
```

### Extending BaseApi

```typescript
import BaseApi from 'flex-rest';

interface User {
  id: number;
  name: string;
  email: string;
}

class UserApi extends BaseApi {
  private baseUrl = 'https://api.example.com';

  constructor() {
    super({ 
      token: 'your-token',
      logFile: 'output/user_api.txt' // separate log file per service
    });
  }

  async getUsers() {
    return this.get<User[]>(`${this.baseUrl}/users`);
  }

  async createUser(data: { name: string; email: string }) {
    return this.post<User>(`${this.baseUrl}/users`, data);
  }

  async updateUser(id: number, data: Partial<User>) {
    return this.put<User>(`${this.baseUrl}/users/${id}`, data);
  }

  async deleteUser(id: number) {
    return this.delete(`${this.baseUrl}/users/${id}`);
  }
}

const api = new UserApi();
const users = await api.getUsers();
```

### CodeceptJS Integration

BaseApi automatically detects CodeceptJS context. No additional setup needed:

```typescript
import BaseApi from 'flex-rest';

class MyApi extends BaseApi {
  async getUsers() {
    return this.get('https://api.example.com/users');
  }
}

// In your CodeceptJS test
Scenario('test API', async ({ I }) => {
  const api = new MyApi({ token: 'test-token' });
  const response = await api.getUsers();
  // Uses I.sendGetRequest automatically
});
```

### PlaywrightApi

```typescript
import { PlaywrightApi } from 'flex-rest';
import { request } from '@playwright/test';

const apiContext = await request.newContext();
const api = new PlaywrightApi(apiContext, 'your-bearer-token');

const response = await api.get('https://api.example.com/users');
const user = await api.post('https://api.example.com/users', { name: 'John' });
```

## API

### BaseApi Options

- `token?: string` - Bearer token for authentication
- `allowInsecureSSL?: boolean` - Allow self-signed certificates
- `logFile?: string` - Custom log file path (default: `output/api_logs.txt`)

### Methods

All APIs support:
- `get<T>(url: string, headers?: object): Promise<HttpResponse<T>>`
- `post<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>>`
- `put<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>>`
- `delete<T>(url: string, headers?: object): Promise<HttpResponse<T>>`
- `head<T>(url: string, headers?: object): Promise<HttpResponse<T>>`

### Response Format

```typescript
interface HttpResponse<T> {
  status: number;
  data: T;
  headers?: Record<string, any>;
}
```

### TypeScript Support

Use generics to type your responses:

```typescript
interface TokenResponse {
  access_token: string;
  expires_in: number;
}

const response = await api.post<TokenResponse>('/auth/token', credentials);
const token = response.data.access_token; // fully typed
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
