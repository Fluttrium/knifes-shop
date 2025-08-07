import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "./types/auth";
import instance from "./config";

export class AuthService {
  async login(userData: LoginRequest): Promise<AuthResponse> {
    const response = await instance.post<AuthResponse>("/auth/login", userData);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await instance.post<AuthResponse>(
      "/auth/register",
      userData,
    );
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await instance.post("/auth/logout");
    } catch {
      // Silent fail for logout
    }
  }

  /**
   * Получение текущего пользователя
   * Использует токен из куки автоматически
   */
  async getCurrentUser(): Promise<User> {
    const response = await instance.get<User>("/auth/me");
    return response.data;
  }

  /**
   * Обновление токена
   * Автоматически обновляет куки с новым токеном
   */
  async refreshToken(): Promise<AuthResponse> {
    const response = await instance.post<AuthResponse>("/auth/refresh");
    return response.data;
  }

  /**
   * Проверка авторизации с автоматическим обновлением токена
   * Возвращает true если пользователь авторизован
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error: any) {
      // Если ошибка 401, пытаемся обновить токен
      if (error.response?.status === 401) {
        try {
          await this.refreshToken();
          // После успешного обновления токена проверяем снова
          await this.getCurrentUser();
          return true;
        } catch (refreshError) {
          return false;
        }
      }
      return false;
    }
  }

  /**
   * Получение роли текущего пользователя
   */
  async getUserRole(): Promise<"admin" | "user" | null> {
    try {
      const user = await this.getCurrentUser();
      return user.role;
    } catch {
      return null;
    }
  }

  /**
   * Проверка на админа
   */
  async isAdmin(): Promise<boolean> {
    const role = await this.getUserRole();
    return role === "admin";
  }
}
