import * as http from 'http'
import supertest from 'supertest'
import type { SuperTest, Test } from 'supertest'
import { SupertestApi } from '../SupertestApi'
import { FlexRestError } from '../../core/errors'
import { createTestServer, startServer, stopServer } from '../../core/__tests__/testServer'

describe('SupertestApi E2E', () => {
  let server: http.Server

  beforeAll(async () => {
    server = createTestServer()
    await startServer(server)
  })

  afterAll(async () => {
    await stopServer(server)
  })

  function makeAgent(): SuperTest<Test> {
    return supertest(server) as unknown as SuperTest<Test>
  }

  it('should make a real GET request', async () => {
    const api = new SupertestApi(makeAgent())
    const res = await api.get<{ id: number; name: string }[]>('/users')

    expect(res.status).toBe(200)
    expect(res.data).toEqual([{ id: 1, name: 'John' }])
  })

  it('should make a real POST request with payload', async () => {
    const api = new SupertestApi(makeAgent())
    const res = await api.post<{ id: number; name: string }>('/users', { name: 'Jane' })

    expect(res.status).toBe(201)
    expect(res.data).toMatchObject({ id: 2, name: 'Jane' })
  })

  it('should make a real PUT request with payload', async () => {
    const api = new SupertestApi(makeAgent())
    const res = await api.put<{ id: number; name: string }>('/users/1', { name: 'Updated' })

    expect(res.status).toBe(200)
    expect(res.data).toMatchObject({ id: 1, name: 'Updated' })
  })

  it('should make a real PATCH request with payload', async () => {
    const api = new SupertestApi(makeAgent())
    const res = await api.patch<{ id: number; name: string }>('/users/1', { name: 'Patched' })

    expect(res.status).toBe(200)
    expect(res.data).toMatchObject({ id: 1, name: 'Patched' })
  })

  it('should make a real DELETE request', async () => {
    const api = new SupertestApi(makeAgent())
    const res = await api.delete('/users/1')

    expect(res.status).toBe(204)
  })

  it('should make a real HEAD request', async () => {
    const api = new SupertestApi(makeAgent())
    const res = await api.head('/users')

    expect(res.status).toBe(200)
    expect(res.headers?.['x-total-count']).toBe('1')
  })

  it('should include Bearer token in Authorization header', async () => {
    const api = new SupertestApi(makeAgent(), 'my-token')
    const res = await api.get<{ auth: string }>('/auth')

    expect(res.status).toBe(200)
    expect(res.data.auth).toBe('Bearer my-token')
  })

  it('should throw FlexRestError on 500 response', async () => {
    const api = new SupertestApi(makeAgent())
    await expect(api.get('/error')).rejects.toThrow(FlexRestError)
    await expect(api.get('/error')).rejects.toMatchObject({ status: 500 })
  })
})
