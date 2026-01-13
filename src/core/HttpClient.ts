export interface HttpResponse<T = any> {
  status: number
  data: T
  headers?: Record<string, any>
}

export interface HttpClient {
  get<T>(url: string, headers?: object): Promise<HttpResponse<T>>
  post<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>>
  put<T>(url: string, payload?: any, headers?: object): Promise<HttpResponse<T>>
  delete<T>(url: string, headers?: object): Promise<HttpResponse<T>>
  head<T>(url: string, headers?: object): Promise<HttpResponse<T>>
}
