# What is flex-rest?

**flex-rest** is a unified REST API client for Node.js testing frameworks. It lets you write your API layer once and use it across multiple testing tools without changing a single line of business logic.

## The Problem

When testing APIs, every framework has its own HTTP interface:

```ts
// Axios
const res = await axios.get('/users')
res.status // number
res.data   // parsed body

// Playwright
const res = await request.get('/users')
res.status() // method call
await res.json() // async

// Supertest
const res = await supertest(app).get('/users')
res.status // number
res.body   // parsed body

// CodeceptJS
const res = await I.sendGetRequest('/users')
res.status // number
res.data   // parsed body
```

Each has a different response shape, different header handling, and different patterns. If you switch frameworks or need to support multiple, you rewrite everything.

## The Solution

flex-rest wraps each framework's HTTP client behind a **unified interface**:

```ts
interface HttpResponse<T> {
  status: number
  data: T
  headers?: Record<string, any>
}
```

Every integration — `BaseApi`, `PlaywrightApi`, `SupertestApi` — returns the exact same shape. Your test helpers, assertions, and API wrappers work identically regardless of the underlying framework.

## When to Use It

- ✅ You maintain API tests across multiple frameworks
- ✅ You want a clean, typed API layer that's framework-agnostic
- ✅ You need consistent auth handling and error behavior
- ✅ You're building a test utility library shared across teams

## Architecture

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
