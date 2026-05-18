/* eslint-disable @typescript-eslint/no-explicit-any */
export interface HttpResponse<T = any> {
  status: number
  data: T
  headers?: Record<string, string>
}

export interface HttpError<T = any> {
  status: number
  message: string
  data?: T
}

export interface HttpRequestConfig {
  headers?: Record<string, string>
  params?: Record<string, any>
  timeout?: number
  cancelPrevious?: boolean
  signal?: AbortSignal
  withCredentials?: boolean
  data?: any
  responseType?: 'blob' | 'json' | 'arraybuffer' | 'document' | 'text' | 'stream'
}

export interface HttpClient {
  get<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>
  post<T>(
    url: string,
    data?: any,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>>
  put<T>(
    url: string,
    data?: any,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>>
  patch<T>(
    url: string,
    data?: any,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>>
  delete<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>
}
