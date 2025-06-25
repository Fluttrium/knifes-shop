import { apiClient } from '@/client/axios.client';
import {
    RegisterDto,
    LoginDto,
    AuthResponse,
    RefreshTokenDto
} from '@knifes-shop/shared';

export class AuthService {
    private static readonly BASE_PATH = '/auth';

    static async register(data: RegisterDto): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>(`${this.BASE_PATH}/register`, data);
        return response.data.data;
    }

    static async login(data: LoginDto): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>(`${this.BASE_PATH}/login`, data);
        return response.data.data;
    }

    static async refreshToken(data: RefreshTokenDto): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>(`${this.BASE_PATH}/refresh`, data);
        return response.data.data;
    }

    static async logout(): Promise<void> {
        await apiClient.post(`${this.BASE_PATH}/logout`);
    }
}