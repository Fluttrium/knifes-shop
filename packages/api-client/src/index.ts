import { AuthService } from "./auth";
import { UserService } from "./user";

// Создаем экземпляры сервисов
const authService = new AuthService();
const userService = new UserService();

// Основной API объект
export const api = {
  auth: authService,
  users: userService,
};

// Экспортируем типы
export type {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ApiError,
  ApiErrorResponse,
} from "./types/auth";

export type { ApiResponse, PaginatedResponse } from "./types/common";

// Экспортируем сервисы отдельно для удобства
export { AuthService } from "./auth";
export { UserService } from "./user";

// Default export
export default api;
