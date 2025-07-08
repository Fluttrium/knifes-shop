import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError, ApiErrorResponse } from './types/auth';

// Создаем базовый instance с поддержкой куки
const instance: AxiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:1488/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Client': 'web-app'
  },
  // КРИТИЧНО: включаем отправку куки
  withCredentials: true,
});

// Request interceptor (убираем всю логику с токенами)
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Добавляем CSRF protection если нужно
    if (process.env.CSRF_TOKEN) {
      config.headers['X-CSRF-Token'] = process.env.CSRF_TOKEN;
    }

    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor для обработки ошибок
instance.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;

    console.error(`❌ API Error: ${status} ${error.config?.url}`, error.response?.data);

    // Обработка 401 - токен истек или недействителен
    if (status === 401) {
      console.log('🔄 Trying to refresh token...');

      try {
        // Пытаемся обновить токен
        await instance.post('/auth/refresh-token');
        console.log('✅ Token refreshed successfully');

        // Повторяем оригинальный запрос
        if (error.config) {
          return instance.request(error.config);
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);

        // Если refresh не удался - перенаправляем на логин
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    // Преобразуем ошибку в стандартный формат с правильной типизацией
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'Unknown error',
      statusCode: status || 500,
      error: error.response?.data?.error
    };

    return Promise.reject(apiError);
  }
);

export default instance;
