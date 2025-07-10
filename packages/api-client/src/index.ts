import { AuthService } from "./auth";
import { UserService } from "./user";


const authService = new AuthService();
const userService = new UserService();


export const api = {
  auth: authService,
  users: userService,
};



export type {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ApiError,
  ApiErrorResponse,
} from "./types/auth";

export type { ApiResponse, PaginatedResponse } from "./types/common";


export { AuthService } from "./auth";
export { UserService } from "./user";


export default api;
