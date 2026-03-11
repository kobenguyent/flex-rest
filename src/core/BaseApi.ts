import axios from 'axios'
import * as https from 'https'
import { HttpClient, HttpResponse, RequestHook, ResponseHook } from './HttpClient'
import { logRequest } from './logger'
import { throwOnServerError } from './errors'

let I: any
try {
  // @ts-ignore
  I = inject().I
} catch {
  I = null
}

export interface BaseApiOptions {
  token?: string
  baseUrl?: string
  allowInsecureSSL?: boolean
  logFile?: string
  timeout?: number
  retry?: { count: number; delay?: number }
  onRequest?: RequestHook
  onResponse?: ResponseHook
}

export default class BaseApi implements HttpClient {
  protected token?: string
  protected baseUrl: string
  protected httpsAgent?: https.Agent
  protected logFile?: string
  protected timeout?: number
  protected retryCount: number
  protected retryDelay: number
  protected onRequest?: RequestHook
  protected onResponse?: ResponseHook

  constructor(options: BaseApiOptions = {}) {
    this.token = options.token
    this.baseUrl = options.baseUrl ?? ''
    this.logFile = options.logFile
    this.timeout = options.timeout
    this.retryCount = options.retry?.count ?? 0
    this.retryDelay = options.retry?.delay ?? 1000
    this.onRequest = options.onRequest
    this.onResponse = options.onResponse
    if (options.allowInsecureSSL) {
      this.httpsAgent = new https.Agent({ rejectUnauthorized: false })
    }
  }

  private buildHeaders(extra?: object) {
    return {
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...extra
    }
  }

  private resolveUrl(url: string): string {
    if (this.baseUrl && !url.startsWith('http')) {
      return `${this.baseUrl.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`
    }
    return url
  }

  private async requestWithRetry<T>(
    method: string,
    url: string,
    payload?: any,
    headers?: object
  ): Promise<HttpResponse<T>> {
    let lastError: any
    for (let attempt = 0; attempt <= this.retryCount; attempt++) {
      try {
        return await this.request<T>(method, url, payload, headers)
      } catch (error) {
        lastError = error
        if (attempt < this.retryCount) {
          await new Promise(r => setTimeout(r, this.retryDelay))
        }
      }
    }
    throw lastError
  }

  private async request<T>(
    method: string,
    url: string,
    payload?: any,
    headers?: object
  ): Promise<HttpResponse<T>> {
    const fullUrl = this.resolveUrl(url)
    const finalHeaders = this.buildHeaders(headers)

    if (this.onRequest) {
      await this.onRequest(method, fullUrl, finalHeaders, payload)
    }

    const res = I
      ? payload !== undefined
        ? await I[`send${method}`](fullUrl, payload, finalHeaders)
        : await I[`send${method}`](fullUrl, finalHeaders)
      : await axios.request({
          method: method.replace('Request', '').toLowerCase(),
          url: fullUrl,
          data: payload,
          headers: finalHeaders,
          httpsAgent: this.httpsAgent,
          timeout: this.timeout
        })

    logRequest(method, fullUrl, finalHeaders, payload, res, this.logFile)
    throwOnServerError(res, fullUrl, res.data)

    const result: HttpResponse<T> = { status: res.status, data: res.data, headers: res.headers }

    if (this.onResponse) {
      await this.onResponse(method, fullUrl, result)
    }

    return result
  }

  get<T>(url: string, headers?: object) {
    return this.requestWithRetry<T>('GetRequest', url, undefined, headers)
  }

  post<T>(url: string, payload?: any, headers?: object) {
    return this.requestWithRetry<T>('PostRequest', url, payload, headers)
  }

  put<T>(url: string, payload?: any, headers?: object) {
    return this.requestWithRetry<T>('PutRequest', url, payload, headers)
  }

  patch<T>(url: string, payload?: any, headers?: object) {
    return this.requestWithRetry<T>('PatchRequest', url, payload, headers)
  }

  delete<T>(url: string, headers?: object) {
    return this.requestWithRetry<T>('DeleteRequest', url, undefined, headers)
  }

  head<T>(url: string, headers?: object) {
    return this.requestWithRetry<T>('HeadRequest', url, undefined, headers)
  }
}
