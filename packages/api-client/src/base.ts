import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'

export class BaseApiClient {
    protected client: AxiosInstance

    constructor(baseURL: string, config?: AxiosRequestConfig) {
        this.client = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
            ...config,
        })

        this.setupInterceptors()
    }

    private setupInterceptors() {
        this.client.interceptors.request.use(
            (config) => config,
            (error) => Promise.reject(error)
        )

        this.client.interceptors.response.use(
            (response) => response,
            (error) => Promise.reject(error)
        )
    }

    protected async request<T>(config: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.request(config)
        return response.data
    }

    public setAuthToken(token: string) {
        this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    public removeAuthToken() {
        delete this.client.defaults.headers.common['Authorization']
    }
}