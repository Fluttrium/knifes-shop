import { api } from "@repo/api-client";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

class AuthService {
  private static instance: AuthService;
  private authState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  };
  private listeners: ((state: AuthState) => void)[] = [];

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.authState));
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      console.log("🔐 Attempting login...");
      const response = await api.auth.login({ email, password });
      console.log("✅ Login successful");
      this.authState = {
        user: {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role,
        },
        isAuthenticated: true,
        isLoading: false,
      };
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error("❌ Login failed:", error);
      this.authState = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
      this.notifyListeners();
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      console.log("🚪 Attempting logout...");
      await api.auth.logout();
      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Logout error:", error);
    } finally {
      this.authState = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
      this.notifyListeners();
    }
  }

  async checkAuth(): Promise<void> {
    try {
      console.log("🔍 Checking authentication...");
      const user = await api.auth.getCurrentUser();
      console.log("✅ Auth check successful");
      this.authState = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        isAuthenticated: true,
        isLoading: false,
      };
    } catch (error) {
      console.error("❌ Auth check failed:", error);
      this.authState = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    }
    this.notifyListeners();
  }

  getState(): AuthState {
    return { ...this.authState };
  }

  isAdmin(): boolean {
    return this.authState.user?.role === "admin";
  }
}

export const authService = AuthService.getInstance();
