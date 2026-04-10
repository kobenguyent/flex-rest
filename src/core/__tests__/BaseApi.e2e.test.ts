import * as http from 'http'
import BaseApi from '../BaseApi'
import { FlexRestError } from '../errors'
import { createTestServer, startServer, stopServer } from './testServer'

describe('BaseApi E2E', () => {
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
    const api = new BaseApi({ baseUrl })
    const res = await api.get<{ id: number; name: string }[]>('/users')

    expect(res.status).toBe(200)
    expect(res.data).toEqual([{ id: 1, name: 'John' }])
  })

  it('should make a real POST request with payload', async () => {
    const api = new BaseApi({ baseUrl })
    const res = await api.post<{ id: number; name: string }>('/users', { name: 'Jane' })

    expect(res.status).toBe(201)
    expect(res.data).toMatchObject({ id: 2, name: 'Jane' })
  })

  it('should make a real PUT request with payload', async () => {
    const api = new BaseApi({ baseUrl })
    const res = await api.put<{ id: number; name: string }>('/users/1', { name: 'Updated' })

    expect(res.status).toBe(200)
    expect(res.data).toMatchObject({ id: 1, name: 'Updated' })
  })

  it('should make a real PATCH request with payload', async () => {
    const api = new BaseApi({ baseUrl })
    const res = await api.patch<{ id: number; name: string }>('/users/1', { name: 'Patched' })

    expect(res.status).toBe(200)
    expect(res.data).toMatchObject({ id: 1, name: 'Patched' })
  })

  it('should make a real DELETE request', async () => {
    const api = new BaseApi({ baseUrl })
    const res = await api.delete('/users/1')

    expect(res.status).toBe(204)
  })

  it('should make a real HEAD request', async () => {
    const api = new BaseApi({ baseUrl })
    const res = await api.head('/users')

    expect(res.status).toBe(200)
    expect(res.headers?.['x-total-count']).toBe('1')
  })

  it('should include Bearer token in Authorization header', async () => {
    const api = new BaseApi({ baseUrl, token: 'my-token' })
    const res = await api.get<{ auth: string }>('/auth')

    expect(res.status).toBe(200)
    expect(res.data.auth).toBe('Bearer my-token')
  })

  it('should throw FlexRestError on 500 response', async () => {
    const api = new BaseApi({ baseUrl })
    await expect(api.get('/error')).rejects.toThrow(FlexRestError)
    await expect(api.get('/error')).rejects.toMatchObject({ status: 500 })
  })

  it('should retry and succeed after transient failures', async () => {
    // Use a server that fails the first request then succeeds
    let calls = 0
    const retryServer = http.createServer((_req, res) => {
      calls++
      if (calls < 2) {
        res.destroy()
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: true }))
      }
    })
    const retryUrl = await startServer(retryServer)

    try {
      const api = new BaseApi({ baseUrl: retryUrl, retry: { count: 2, delay: 10 } })
      const res = await api.get<{ ok: boolean }>('/test')
      expect(res.status).toBe(200)
      expect(res.data).toEqual({ ok: true })
      expect(calls).toBe(2)
    } finally {
      await stopServer(retryServer)
    }
  })

  it('should call onRequest and onResponse hooks', async () => {
    const onRequest = jest.fn()
    const onResponse = jest.fn()
    const api = new BaseApi({ baseUrl, onRequest, onResponse })

    await api.get('/users')

    expect(onRequest).toHaveBeenCalledWith(
      'GetRequest',
      expect.stringContaining('/users'),
      expect.any(Object),
      undefined
    )
    expect(onResponse).toHaveBeenCalledWith(
      'GetRequest',
      expect.stringContaining('/users'),
      expect.objectContaining({ status: 200 })
    )
  })
})
