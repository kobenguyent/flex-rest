import axios from 'axios'
import * as https from 'https'
import { HttpResponse } from './HttpClient'
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
  allowInsecureSSL?: boolean
  logFile?: string
}

export default class BaseApi {
  protected token?: string
  protected httpsAgent?: https.Agent
  protected logFile?: string

  constructor(options: BaseApiOptions = {}) {
    this.token = options.token
    this.logFile = options.logFile
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

  private async request<T>(
    method: string,
    url: string,
    payload?: any,
    headers?: object
  ): Promise<HttpResponse<T>> {
    const finalHeaders = this.buildHeaders(headers)

    const res = I
      ? payload !== undefined
        ? await I[`send${method}`](url, payload, finalHeaders)
        : await I[`send${method}`](url, finalHeaders)
      : await axios.request({
          method: method.replace('Request', '').toLowerCase(),
          url,
          data: payload,
          headers: finalHeaders,
          httpsAgent: this.httpsAgent
        })

    logRequest(method, url, finalHeaders, payload, res, this.logFile)
    throwOnServerError(res, url)

    return { status: res.status, data: res.data, headers: res.headers }
  }

  get<T>(url: string, headers?: object) {
    return this.request<T>('GetRequest', url, undefined, headers)
  }

  post<T>(url: string, payload?: any, headers?: object) {
    return this.request<T>('PostRequest', url, payload, headers)
  }

  put<T>(url: string, payload?: any, headers?: object) {
    return this.request<T>('PutRequest', url, payload, headers)
  }

  delete<T>(url: string, headers?: object) {
    return this.request<T>('DeleteRequest', url, undefined, headers)
  }

  head<T>(url: string, headers?: object) {
    return this.request<T>('HeadRequest', url, undefined, headers)
  }
}
