import { APIRequestContext } from '@playwright/test'
import { HttpResponse } from '../core/HttpClient'
import { throwOnServerError } from '../core/errors'

export class PlaywrightApi {
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

  async get<T>(url: string, headers?: object): Promise<HttpResponse<T>> {
    const res = await this.request.get(url, { headers: this.headers(headers) })
    const data = await res.json()
    throwOnServerError(res, url)
    return { status: res.status(), data }
  }

  async post<T>(url: string, payload?: any, headers?: object) {
    const res = await this.request.post(url, {
      data: payload,
      headers: this.headers(headers)
    })
    const data = await res.json()
    throwOnServerError(res, url)
    return { status: res.status(), data }
  }
}
