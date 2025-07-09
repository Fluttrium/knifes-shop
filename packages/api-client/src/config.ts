import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiError, ApiErrorResponse } from "./types/auth";

// Расширяем интерфейс для добавления _retry
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const instance: AxiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL || "http://localhost:1488/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "X-Client": "web-app",
  },
  withCredentials: true,
});

// Флаг для предотвращения множественных refresh запросов
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

// Используем WeakSet для отслеживания повторных попыток
const retriedRequests = new WeakSet();

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

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (process.env.CSRF_TOKEN) {
      config.headers["X-CSRF-Token"] = process.env.CSRF_TOKEN;
    }

    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
    );
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    console.error(
      `❌ API Error: ${status} ${originalRequest?.url}`,
      error.response?.data,
    );

    if (status === 401 && originalRequest && !retriedRequests.has(originalRequest)) {
      // Исключаем refresh endpoint из повторных попыток
      if (originalRequest.url === '/auth/refresh') {
        console.log("🚫 Refresh token expired, redirecting to login");

        if (typeof window !== "undefined") {
          window.location.href = "/signin";
        }

        return Promise.reject(error);
      }

      // Если уже идет процесс refresh, добавляем запрос в очередь
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return instance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      retriedRequests.add(originalRequest);
      isRefreshing = true;

      try {
        console.log("🔄 Trying to refresh token...");

        await instance.post("/auth/refresh");
        console.log("✅ Token refreshed successfully");

        isRefreshing = false;
        processQueue(null, 'success');

        return instance(originalRequest);
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);

        isRefreshing = false;
        processQueue(refreshError, null);

        if (typeof window !== "undefined") {
          window.location.href = "/signin";
        }

        return Promise.reject(refreshError);
      }
    }

    const apiError: ApiError = {
      message:
        error.response?.data?.message || error.message || "Unknown error",
      statusCode: status || 500,
      error: error.response?.data?.error,
    };

    return Promise.reject(apiError);
  },
);

export default instance;