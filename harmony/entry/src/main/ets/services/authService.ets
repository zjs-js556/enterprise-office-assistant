import { httpClient, HttpResponse } from './http';
import { LoginRequest, LoginResponse, User } from '../models/User';

export class AuthService {
  static async login(username: string, password: string): Promise<HttpResponse<LoginResponse>> {
    const body: LoginRequest = { username, password };
    return httpClient.post<LoginResponse>('/auth/login', body);
  }

  static async getMe(): Promise<HttpResponse<User>> {
    return httpClient.get<User>('/auth/me');
  }
}
