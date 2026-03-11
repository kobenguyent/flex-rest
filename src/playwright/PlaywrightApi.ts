import { APIRequestContext } from '@playwright/test'
import { HttpClient, HttpResponse } from '../core/HttpClient'
import { throwOnServerError } from '../core/errors'

export class PlaywrightApi implements HttpClient {
  constructor(
    private request: APIRequestContext,
    private token?: string
  ) {}

  private headers(extra?: object) {
    return {
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...extra
    }
  }

  private async safeJson(res: any): Promise<any> {
    try {
      return await res.json()
    } catch {
      return null
    }
  }

  async get<T>(url: string, headers?: object): Promise<HttpResponse<T>> {
    const res = await this.request.get(url, { headers: this.headers(headers) })
    const data = await this.safeJson(res)
    throwOnServerError(res, url, data)
    return { status: res.status(), data, headers: res.headers() }
  }

  async post<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>> {
    const res = await this.request.post(url, {
      data: payload,
      headers: this.headers(headers)
    })
    const data = await this.safeJson(res)
    throwOnServerError(res, url, data)
    return { status: res.status(), data, headers: res.headers() }
  }

  async put<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>> {
    const res = await this.request.put(url, {
      data: payload,
      headers: this.headers(headers)
    })
    const data = await this.safeJson(res)
    throwOnServerError(res, url, data)
    return { status: res.status(), data, headers: res.headers() }
  }

  async patch<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>> {
    const res = await this.request.patch(url, {
      data: payload,
      headers: this.headers(headers)
    })
    const data = await this.safeJson(res)
    throwOnServerError(res, url, data)
    return { status: res.status(), data, headers: res.headers() }
  }

  async delete<T>(url: string, headers?: object): Promise<HttpResponse<T>> {
    const res = await this.request.delete(url, { headers: this.headers(headers) })
    const data = await this.safeJson(res)
    throwOnServerError(res, url, data)
    return { status: res.status(), data, headers: res.headers() }
  }

  async head<T>(url: string, headers?: object): Promise<HttpResponse<T>> {
    const res = await this.request.head(url, { headers: this.headers(headers) })
    throwOnServerError(res, url)
    return { status: res.status(), data: {} as T, headers: res.headers() }
  }
}
