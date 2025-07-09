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
}
