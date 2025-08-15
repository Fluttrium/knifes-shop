import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";


const API_BASE_URL = 'http://localhost:3004/api/v1/';

// Флаг для предотвращения множественных запросов refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Создание экземпляра axios с базовой конфигурацией
const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Включаем отправку куки
  timeout: 10000, // Таймаут 10 секунд
  headers: {
    "Content-Type": "application/json",
   // "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
});

// Интерцептор запросов
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Добавляем CSRF токен если он есть
    const csrfToken = process.env.NEXT_PUBLIC_CSRF_TOKEN;
    if (csrfToken && config.headers) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  },
);

// Интерцептор ответов
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;

    // Если ошибка 401 и это не запрос на refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      if (isRefreshing) {
        // Если уже идет обновление токена, добавляем в очередь
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return instance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Пытаемся обновить токен
        await instance.post("/auth/refresh");
        processQueue(null, null);
        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Если refresh не удался, не перенаправляем автоматически
        // Пусть компоненты сами решают что делать
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
