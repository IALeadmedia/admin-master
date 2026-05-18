import { Navigate } from '@tanstack/react-router'
import { LocalStorageKeys } from '../enums/LocalStorageKeys.enum'
import { AxiosHttpClient } from '../lib/axios'
import type { HttpClient, HttpRequestConfig } from '../types/adapter/IAdapter.type'
import { toast } from "sonner";

export class HttpClientFactory {
  static createHttpClient(
    type: 'axios' | 'fetch' = 'axios',
    baseURL?: string,
    config?: HttpRequestConfig,
  ): HttpClient {
    switch (type) {
      case 'axios':
        return new AxiosHttpClient(baseURL, config)
      default:
        throw new Error(`Tipo de HttpClient não suportado: ${type}`)
    }
  }

  static handleErrorRequest(status: number) {
    if (status === 401) {
      localStorage.removeItem(LocalStorageKeys.user)

      toast.error('Sessão expirada', {
        description: 'Sua sessão expirou. Por favor, faça login novamente.',
      })
      Navigate({ to: '/login' })
    }
    else if (status === 500) {
      toast.error('Erro do Servidor Interno', {
        description: 'Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.',
      })
    }
    else if (status === 403) {
      Navigate({ to: '/app', replace: true })
    }
  }
}
