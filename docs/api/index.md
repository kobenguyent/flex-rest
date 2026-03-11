# API Reference

Complete API documentation for all flex-rest exports.

## Exports

```ts
import BaseApi, { PlaywrightApi, SupertestApi, FlexRestError } from 'flex-rest'
import type { HttpResponse, HttpClient, RequestHook, ResponseHook, BaseApiOptions } from 'flex-rest'
```

## Classes

| Class | Wraps | Docs |
|-------|-------|------|
| [`BaseApi`](/api/base-api) | Axios / CodeceptJS | Default integration with baseUrl, timeout, retry, hooks, logging |
| [`PlaywrightApi`](/api/playwright-api) | `@playwright/test` | Full HTTP method support with safe JSON parsing |
| [`SupertestApi`](/api/supertest-api) | `supertest` | In-process Express/Node.js server testing |
| [`FlexRestError`](/guide/error-handling) | — | Custom error thrown on 5xx responses |

## Interfaces

| Interface | Description |
|-----------|-------------|
| [`HttpResponse<T>`](/api/http-response) | Unified response shape returned by all methods |
| [`HttpClient`](/api/http-response#httpclient) | Common method contract for all integrations |
| `RequestHook` | `(method, url, headers, payload?) => void` |
| `ResponseHook` | `(method, url, response) => void` |

## Common Method Signatures

All classes implement:

```ts
get<T>(url: string, headers?: object): Promise<HttpResponse<T>>
post<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>>
put<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>>
patch<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>>
delete<T>(url: string, headers?: object): Promise<HttpResponse<T>>
head<T>(url: string, headers?: object): Promise<HttpResponse<T>>
```
