import axios, {AxiosInstance, AxiosError, AxiosResponse} from 'axios';
import {ApiError, ApiResponse} from '@knifes-shop/shared';

export class ApiClient {
    private instance: AxiosInstance;
    private baseURL: string;

    constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') {
        this.baseURL = baseURL;
        this.instance = axios.create({
            baseURL: this.baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request interceptor для добавления токена
        this.instance.interceptors.request.use(
            (config) => {
                const token = this.getAuthToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor для обработки ответов
        this.instance.interceptors.response.use(
            (response: AxiosResponse<ApiResponse>) => response,
            (error: AxiosError) => {
                const apiError = this.handleError(error);
                return Promise.reject(apiError);
            }
        );
    }

    private getAuthToken(): string | null {
        // В реальном проекте здесь будет логика получения токена
        // из localStorage, cookies или контекста
        if (typeof window !== 'undefined') {
            return localStorage.getItem('accessToken');
        }
        return null;
    }

    private handleError(error: AxiosError): ApiError {
        if (error.response) {
            // Сервер ответил с кодом ошибки
            const {status, data} = error.response;
            return {
                message: (data as any)?.message || 'Произошла ошибка на сервере',
                status,
                code: (data as any)?.code,
                details: (data as any)?.details,
            };
        } else if (error.request) {
            // Запрос был отправлен, но ответа не получено
            return {
                message: 'Сервер не отвечает. Проверьте подключение к интернету.',
                status: 0,
                code: 'NETWORK_ERROR',
            };
        } else {
            // Что-то пошло не так при настройке запроса
            return {
                message: error.message || 'Неизвестная ошибка',
                status: 0,
                code: 'UNKNOWN_ERROR',
            };
        }
    }

    // Публичные методы для HTTP запросов
    public get<T = any>(url: string, params?: any): Promise<AxiosResponse<ApiResponse<T>>> {
        return this.instance.get(url, {params});
    }

    public post<T = any>(url: string, data?: any): Promise<AxiosResponse<ApiResponse<T>>> {
        return this.instance.post(url, data);
    }

    public put<T = any>(url: string, data?: any): Promise<AxiosResponse<ApiResponse<T>>> {
        return this.instance.put(url, data);
    }

    public delete<T = any>(url: string): Promise<AxiosResponse<ApiResponse<T>>> {
        return this.instance.delete(url);
    }

    public patch<T = any>(url: string, data?: any): Promise<AxiosResponse<ApiResponse<T>>> {
        return this.instance.patch(url, data);
    }
}

// Экспорт singleton instance
export const apiClient = new ApiClient();