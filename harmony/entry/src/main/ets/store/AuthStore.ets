import { StorageUtil } from '../utils/storage';
import { httpClient } from '../services/http';
import { AuthService } from '../services/authService';

const TOKEN_KEY = 'auth_token';
const USERNAME_KEY = 'auth_username';
const ROLE_KEY = 'auth_role';

interface LoginResult {
  success: boolean;
  message: string;
}

export class AuthStore {
  private static instance: AuthStore;

  isLoggedIn: boolean = false;
  token: string = '';
  username: string = '';
  role: string = '';

  private loginCallbacks: Array<() => void> = [];
  private logoutCallbacks: Array<() => void> = [];

  static getInstance(): AuthStore {
    if (!AuthStore.instance) {
      AuthStore.instance = new AuthStore();
    }
    return AuthStore.instance;
  }

  onLogin(callback: () => void): void {
    this.loginCallbacks.push(callback);
  }

  onLogout(callback: () => void): void {
    this.logoutCallbacks.push(callback);
  }

  private notifyLogin(): void {
    for (let i = 0; i < this.loginCallbacks.length; i++) {
      this.loginCallbacks[i]();
    }
  }

  private notifyLogout(): void {
    for (let i = 0; i < this.logoutCallbacks.length; i++) {
      this.logoutCallbacks[i]();
    }
  }

  async initialize(): Promise<void> {
    const token = await StorageUtil.getString(TOKEN_KEY);
    const username = await StorageUtil.getString(USERNAME_KEY);
    const role = await StorageUtil.getString(ROLE_KEY);

    if (token) {
      this.token = token;
      this.username = username || '';
      this.role = role || '';
      this.isLoggedIn = true;
      httpClient.setToken(token);
    }
  }

  async login(username: string, password: string): Promise<LoginResult> {
    const response = await AuthService.login(username, password);

    if (response.code === 200 && response.data?.token) {
      const data = response.data;
      this.token = data.token;
      this.username = data.username;
      this.role = data.role;
      this.isLoggedIn = true;

      httpClient.setToken(data.token);

      await StorageUtil.setString(TOKEN_KEY, data.token);
      await StorageUtil.setString(USERNAME_KEY, data.username);
      await StorageUtil.setString(ROLE_KEY, data.role);

      this.notifyLogin();
      const result: LoginResult = { success: true, message: response.message || '登录成功' };
      return result;
    }

    const result: LoginResult = { success: false, message: response.message || '登录失败' };
    return result;
  }

  async logout(): Promise<void> {
    this.token = '';
    this.username = '';
    this.role = '';
    this.isLoggedIn = false;

    httpClient.setToken(null);

    await StorageUtil.remove(TOKEN_KEY);
    await StorageUtil.remove(USERNAME_KEY);
    await StorageUtil.remove(ROLE_KEY);

    this.notifyLogout();
  }

  getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }
}
