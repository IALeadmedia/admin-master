/* eslint-disable @typescript-eslint/no-explicit-any */


import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
} from 'axios'
import { getCookie } from './cookies'
import { CookieKeys } from '../enums/CookieKeys.enum'
import type { HttpClient, HttpRequestConfig, HttpResponse } from '../types/adapter/IAdapter.type'
import type { CustomRequestConfig } from '../types/adapter/IAxiosCustom.type'


export class AxiosHttpClient implements HttpClient {
  private axiosInstance: AxiosInstance
  private pendingRequests: Map<string, () => void> = new Map()

  constructor(baseURL?: string, config?: HttpRequestConfig) {
    const axiosConfig = {
      ...(config || {}),
      ...(baseURL ? { baseURL } : {}),
    }

    this.axiosInstance = axios.create(axiosConfig)

    // RESPONSE
    this.axiosInstance.interceptors.response.use(
      (response: any) => {
        if (response.config.cancelPrevious) this.clearPendingRequest(response.config)

        return response
      },
      async (error) => {
        const config = error.config as CustomRequestConfig

        if (config.cancelPrevious) this.clearPendingRequest(config)

        return Promise.reject(error)
      },
    )

    // REQUEST
    this.axiosInstance.interceptors.request.use(
      async (config: CustomRequestConfig) => {
        const token = getCookie(CookieKeys.accessToken)
        if (token) {
          config.headers['authorization'] = `Bearer ${token}`
        }

        if (config.cancelPrevious) this.handlePendingRequest(config)

        return config
      },
    )
  }

  async get<T>(
    url: string,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.get(url, config)

    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>,
    }
  }

  async post<T>(
    url: string,
    data?: any,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.post(url, data, config)
    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>,
    }
  }

  async put<T>(
    url: string,
    data?: any,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.put(url, data, config)
    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>,
    }
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.patch(url, data, config)
    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>,
    }
  }

  async delete<T>(
    url: string,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.delete(url, config)
    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>,
    }
  }

  extractBaseRoute(url: string): string {
    return url.replace(/\/[^/]+(?=\/?$)/, (match) => {
      // Remove se for número ou UUID
      return /^[0-9a-fA-F-]+$/.test(match.slice(1)) ? '' : match
    })
  }

  getRequestKey(config: AxiosRequestConfig): string {
    const method = (config.method || 'get').toLowerCase()
    const url = config.url || ''
    const baseRoute = this.extractBaseRoute(url)
    return `${method}:${baseRoute}`
  }

  clearPendingRequest(config: CustomRequestConfig): void {
    const requestKey = this.getRequestKey(config)
    const fullKey = `${requestKey}:${config.url}`
    this.pendingRequests.delete(fullKey)
  }

  handlePendingRequest(config: CustomRequestConfig): void {
    const requestKey = this.getRequestKey(config)

    for (const [key, cancel] of this.pendingRequests.entries()) {
      if (key.startsWith(requestKey)) {
        cancel() // cancela a requisição anterior
        this.pendingRequests.delete(key)
      }
    }

    const controller = new AbortController()
    config.signal = controller.signal

    const fullKey = `${requestKey}:${config.url}`
    this.pendingRequests.set(fullKey, () => controller.abort())
  }
}