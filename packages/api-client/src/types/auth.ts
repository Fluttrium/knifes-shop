export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  passwordconf: string;
  image?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  image?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
