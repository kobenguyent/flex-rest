import * as http from 'http'
import { request } from '@playwright/test'
import { PlaywrightApi } from '../PlaywrightApi'
import { FlexRestError } from '../../core/errors'
import { createTestServer, startServer, stopServer } from '../../core/__tests__/testServer'

describe('PlaywrightApi E2E', () => {
  let server: http.Server
  let baseUrl: string

  beforeAll(async () => {
    server = createTestServer()
    baseUrl = await startServer(server)
  })

  afterAll(async () => {
    await stopServer(server)
  })

  it('should make a real GET request', async () => {
    const ctx = await request.newContext({ baseURL: baseUrl })
    try {
      const api = new PlaywrightApi(ctx)
      const res = await api.get<{ id: number; name: string }[]>('/users')

      expect(res.status).toBe(200)
      expect(res.data).toEqual([{ id: 1, name: 'John' }])
    } finally {
      await ctx.dispose()
    }
  })

  it('should make a real POST request with payload', async () => {
    const ctx = await request.newContext({ baseURL: baseUrl })
    try {
      const api = new PlaywrightApi(ctx)
      const res = await api.post<{ id: number; name: string }>('/users', { name: 'Jane' })

      expect(res.status).toBe(201)
      expect(res.data).toMatchObject({ id: 2, name: 'Jane' })
    } finally {
      await ctx.dispose()
    }
  })

  it('should make a real PUT request with payload', async () => {
    const ctx = await request.newContext({ baseURL: baseUrl })
    try {
      const api = new PlaywrightApi(ctx)
      const res = await api.put<{ id: number; name: string }>('/users/1', { name: 'Updated' })

      expect(res.status).toBe(200)
      expect(res.data).toMatchObject({ id: 1, name: 'Updated' })
    } finally {
      await ctx.dispose()
    }
  })

  it('should make a real PATCH request with payload', async () => {
    const ctx = await request.newContext({ baseURL: baseUrl })
    try {
      const api = new PlaywrightApi(ctx)
      const res = await api.patch<{ id: number; name: string }>('/users/1', { name: 'Patched' })

      expect(res.status).toBe(200)
      expect(res.data).toMatchObject({ id: 1, name: 'Patched' })
    } finally {
      await ctx.dispose()
    }
  })

  it('should make a real DELETE request', async () => {
    const ctx = await request.newContext({ baseURL: baseUrl })
    try {
      const api = new PlaywrightApi(ctx)
      const res = await api.delete('/users/1')

      expect(res.status).toBe(204)
    } finally {
      await ctx.dispose()
    }
  })

  it('should make a real HEAD request', async () => {
    const ctx = await request.newContext({ baseURL: baseUrl })
    try {
      const api = new PlaywrightApi(ctx)
      const res = await api.head('/users')

      expect(res.status).toBe(200)
      expect(res.headers?.['x-total-count']).toBe('1')
    } finally {
      await ctx.dispose()
    }
  })

  it('should include Bearer token in Authorization header', async () => {
    const ctx = await request.newContext({ baseURL: baseUrl })
    try {
      const api = new PlaywrightApi(ctx, 'my-token')
      const res = await api.get<{ auth: string }>('/auth')

      expect(res.status).toBe(200)
      expect(res.data.auth).toBe('Bearer my-token')
    } finally {
      await ctx.dispose()
    }
  })

  it('should throw FlexRestError on 500 response', async () => {
    const ctx = await request.newContext({ baseURL: baseUrl })
    try {
      const api = new PlaywrightApi(ctx)
      await expect(api.get('/error')).rejects.toThrow(FlexRestError)
      await expect(api.get('/error')).rejects.toMatchObject({ status: 500 })
    } finally {
      await ctx.dispose()
    }
  })
})
