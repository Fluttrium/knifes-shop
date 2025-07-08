
import { AuthResponse, RegisterRequest, User } from "./types/auth";
import instance from "./config";

export class AuthService {
  /**
   * Логин пользователя
   * Токен автоматически сохраняется в httpOnly куки
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await instance.post<AuthResponse>("/auth/login", {
      email,
      password,
    });

    console.log("✅ Login successful");
    return response.data;
  }

  /**
   * Регистрация пользователя
   * После регистрации пользователь автоматически авторизован
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await instance.post<AuthResponse>(
      "/auth/register",
      userData,
    );

    console.log("✅ Registration successful");
    return response.data;
  }

  /**
   * Логаут пользователя
   * Куки автоматически очищаются на сервере
   */
  async logout(): Promise<void> {
    try {
      await instance.post("/auth/logout");
      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Logout error:", error);
      // Даже если запрос failed, считаем что пользователь разлогинился
    }
  }

  /**
   * Получение текущего пользователя
   * Использует токен из куки автоматически
   */
  async getCurrentUser(): Promise<User> {
    const response = await instance.get<User>("/auth/refresh-token");
    return response.data;
  }

  /**
   * Обновление токена
   * Автоматически обновляет куки с новым токеном
   */
  async refreshToken(): Promise<AuthResponse> {
    const response = await instance.get<AuthResponse>("/auth/refresh-token");
    console.log("✅ Token refreshed");
    return response.data;
  }

  /**
   * Проверка авторизации
   * Возвращает true если пользователь авторизован
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
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
    } catch (error) {
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
