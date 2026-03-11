import type { Test, SuperTest } from 'supertest'
import { HttpClient, HttpResponse } from '../core/HttpClient'
import { throwOnServerError } from '../core/errors'

export class SupertestApi implements HttpClient {
  constructor(
    private agent: SuperTest<Test>,
    private token?: string
  ) {}

  private applyHeaders(req: Test, extra?: object): Test {
    if (this.token) {
      req = req.set('Authorization', `Bearer ${this.token}`)
    }
    if (extra) {
      for (const [key, value] of Object.entries(extra)) {
        req = req.set(key, value)
      }
    }
    return req
  }

  async get<T>(url: string, headers?: object): Promise<HttpResponse<T>> {
    const res = await this.applyHeaders(this.agent.get(url), headers)
    throwOnServerError(res, url, res.body)
    return { status: res.status, data: res.body, headers: res.headers }
  }

  async post<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>> {
    let req = this.agent.post(url)
    if (payload !== undefined) {
      req = req.send(payload)
    }
    const res = await this.applyHeaders(req, headers)
    throwOnServerError(res, url, res.body)
    return { status: res.status, data: res.body, headers: res.headers }
  }

  async put<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>> {
    let req = this.agent.put(url)
    if (payload !== undefined) {
      req = req.send(payload)
    }
    const res = await this.applyHeaders(req, headers)
    throwOnServerError(res, url, res.body)
    return { status: res.status, data: res.body, headers: res.headers }
  }

  async patch<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>> {
    let req = this.agent.patch(url)
    if (payload !== undefined) {
      req = req.send(payload)
    }
    const res = await this.applyHeaders(req, headers)
    throwOnServerError(res, url, res.body)
    return { status: res.status, data: res.body, headers: res.headers }
  }

  async delete<T>(url: string, headers?: object): Promise<HttpResponse<T>> {
    const res = await this.applyHeaders(this.agent.delete(url), headers)
    throwOnServerError(res, url, res.body)
    return { status: res.status, data: res.body, headers: res.headers }
  }

  async head<T>(url: string, headers?: object): Promise<HttpResponse<T>> {
    const res = await this.applyHeaders(this.agent.head(url), headers)
    throwOnServerError(res, url)
    return { status: res.status, data: {} as T, headers: res.headers }
  }
}
