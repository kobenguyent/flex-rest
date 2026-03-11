# API Reference

Complete API documentation for all flex-rest exports.

## Exports

```ts
import BaseApi, { PlaywrightApi, SupertestApi } from 'flex-rest'
import type { HttpResponse, HttpClient } from 'flex-rest'
```

## Classes

| Class | Wraps | Docs |
|-------|-------|------|
| [`BaseApi`](/api/base-api) | Axios / CodeceptJS | Default integration with logging and SSL support |
| [`PlaywrightApi`](/api/playwright-api) | `@playwright/test` | Playwright API request context wrapper |
| [`SupertestApi`](/api/supertest-api) | `supertest` | In-process Express/Node.js server testing |

## Interfaces

| Interface | Description |
|-----------|-------------|
| [`HttpResponse<T>`](/api/http-response) | Unified response shape returned by all methods |
| [`HttpClient`](/api/http-response#httpclient) | Common method contract for all integrations |

## Common Method Signatures

All classes implement:

```ts
get<T>(url: string, headers?: object): Promise<HttpResponse<T>>
post<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>>
put<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>>
delete<T>(url: string, headers?: object): Promise<HttpResponse<T>>
head<T>(url: string, headers?: object): Promise<HttpResponse<T>>
```
