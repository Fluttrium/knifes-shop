import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

// Переменные окружения для API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:1488/api/v1";

// Создание экземпляра axios с базовой конфигурацией
const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Включаем отправку куки
  timeout: 10000, // Таймаут 10 секунд
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
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
  (error: unknown) => {
    // Обработка ошибок
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
    } else {
      console.error("Unknown Error:", error);
    }
    return Promise.reject(error);
  },
);

export default instance;
