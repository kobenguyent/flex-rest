export interface HttpResponse<T = any> {
  status: number
  data: T
  headers?: Record<string, any>
}

export interface HttpClient {
  get<T>(url: string, headers?: object): Promise<HttpResponse<T>>
  post<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>>
  put<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>>
  patch<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>>
  delete<T>(url: string, headers?: object): Promise<HttpResponse<T>>
  head<T>(url: string, headers?: object): Promise<HttpResponse<T>>
}

export interface RequestHook {
  (method: string, url: string, headers: object, payload?: any): void | Promise<void>
}

export interface ResponseHook {
  (method: string, url: string, response: HttpResponse): void | Promise<void>
}
