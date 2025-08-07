import { api } from "@repo/api-client";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
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

  private setState(newState: Partial<AuthState>) {
    this.authState = { ...this.authState, ...newState };
    this.notifyListeners();
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      this.setState({ isLoading: true });
      const response = await api.auth.login({ email, password });
      this.setState({
        user: {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role,
        },
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (error) {
      this.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      this.setState({ isLoading: true });
      await api.auth.logout();
    } catch (error) {
    } finally {
      this.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }

  async checkAuth(): Promise<void> {
    try {
      this.setState({ isLoading: true });
      
      const isAuth = await api.auth.isAuthenticated();
      
      if (isAuth) {
        const user = await api.auth.getCurrentUser();
        this.setState({
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        this.setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      this.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }

  getState(): AuthState {
    return { ...this.authState };
  }

  isAdmin(): boolean {
    return this.authState.user?.role === "admin";
  }
}

export const authService = AuthService.getInstance();
