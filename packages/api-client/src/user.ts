import { User } from "./types/auth";
import instance from "./config";

export class UserService {
  async getAllUsers(): Promise<User[]> {
    const response = await instance.get<User[]>("/users");
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await instance.get<User>(`/users/${id}`);
    return response.data;
  }

  async getUserByEmail(email: string): Promise<User> {
    const response = await instance.get<User>(`/users/email/${email}`);
    return response.data;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await instance.patch<User>(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const response = await instance.delete(`/users/${id}`);
    return response.data;
  }

  // Admin methods
  async getAllUsersAdmin(query?: any): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await instance.get(`/admin/users?${params.toString()}`);
    return response.data;
  }

  async getUserStatistics(): Promise<{
    totalUsers: number;
    adminUsers: number;
    regularUsers: number;
    todayUsers: number;
    thisWeekUsers: number;
    thisMonthUsers: number;
    usersWithOrders: number;
    averageOrdersPerUser: number;
  }> {
    const response = await instance.get("/admin/users/statistics");
    return response.data;
  }

  async getCurrentUserStats(): Promise<{
    totalOrders: number;
    totalSpent: number;
    totalAddresses: number;
    lastOrderDate?: string;
  }> {
    const response = await instance.get("/users/me/stats");
    return response.data;
  }
}
