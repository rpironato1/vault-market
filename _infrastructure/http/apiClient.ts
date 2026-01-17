import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Configuração base
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Requisição
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. Adicionar Request ID para rastreabilidade
    const requestId = uuidv4();
    config.headers['X-Request-ID'] = requestId;

    // 2. Injeção de Token de Autenticação
    // Nota: Em uma implementação real, isso viria de um storage seguro ou cookie httpOnly.
    // Para este client, assumimos localStorage por enquanto.
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Resposta
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    // 1. Normalização de Erros
    if (!error.response) {
      // Erro de rede / offline
      console.error('[Network Error]', error.message);
      return Promise.reject(new Error('Falha na conexão com o servidor. Verifique sua internet.'));
    }

    // 2. Tratamento de 401 (Não Autorizado)
    if (error.response.status === 401) {
      // TODO: Implementar lógica de refresh token aqui se necessário
      console.warn('[Auth Error] Sessão expirada ou inválida.');
      
      // Evitar loop infinito de redirects
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    }

    // 3. Tratamento de 403 (Proibido)
    if (error.response.status === 403) {
      console.error('[Access Denied] Você não tem permissão para esta ação.');
    }

    // Retorna o erro padronizado para ser tratado no catch da feature
    return Promise.reject(error.response.data || error.message);
  }
);

// Wrapper Tipado para facilitar uso com Zod futuramente
export const http = {
  get: <T>(url: string, config = {}) => apiClient.get<T>(url, config).then(res => res.data),
  post: <T>(url: string, data = {}, config = {}) => apiClient.post<T>(url, data, config).then(res => res.data),
  put: <T>(url: string, data = {}, config = {}) => apiClient.put<T>(url, data, config).then(res => res.data),
  delete: <T>(url: string, config = {}) => apiClient.delete<T>(url, config).then(res => res.data),
};