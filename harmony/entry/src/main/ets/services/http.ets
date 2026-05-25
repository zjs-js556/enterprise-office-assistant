import { http } from '@kit.NetworkKit';
import { StorageUtil } from '../utils/storage';

const BASE_URL = 'http://114.55.171.7/api/v1';
const TIMEOUT = 15000;

const TOKEN_KEY = 'auth_token';

export interface RequestOptions {
  params?: Record<string, string | number>;
}

export interface HttpResponse<T> {
  code: number;
  message: string;
  data: T;
}

class HttpClient {
  private token: string | null = null;

  setToken(token: string | null): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  async loadToken(): Promise<void> {
    const savedToken = await StorageUtil.getString(TOKEN_KEY);
    if (savedToken) {
      this.token = savedToken;
    }
  }

  private buildUrl(path: string, params?: Record<string, string | number>): string {
    let url = `${BASE_URL}${path}`;
    if (params) {
      const queryParts: string[] = [];
      const keys = Object.keys(params);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = params[key];
        if (value !== undefined && value !== null && value !== '') {
          queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
        }
      }
      if (queryParts.length > 0) {
        url += '?' + queryParts.join('&');
      }
    }
    return url;
  }

  private async request<T>(
    method: http.RequestMethod,
    path: string,
    body?: Object,
    options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    const url = this.buildUrl(path, options?.params);

    const httpRequest = http.createHttp();
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const requestOptions: http.HttpRequestOptions = {
        method: method,
        header: headers,
        connectTimeout: TIMEOUT,
        readTimeout: TIMEOUT
      };

      if (body) {
        requestOptions.extraData = JSON.stringify(body);
      }

      const response = await httpRequest.request(url, requestOptions);
      const responseBody = response.result as string;

      httpRequest.destroy();

      let parsed: HttpResponse<T>;
      try {
        parsed = JSON.parse(responseBody) as HttpResponse<T>;
      } catch (parseErr) {
        return {
          code: -1,
          message: '响应数据解析失败',
          data: null as T
        };
      }

      if (parsed.code === 401) {
        await StorageUtil.remove(TOKEN_KEY);
        this.token = null;
      }

      return parsed;
    } catch (err) {
      httpRequest.destroy();
      const error = err as Error;
      console.error('HTTP request error:', url, JSON.stringify(error));
      return {
        code: -1,
        message: `网络请求失败: ${error.message || '未知错误'}`,
        data: null as T
      };
    }
  }

  async get<T>(path: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>(http.RequestMethod.GET, path, undefined, options);
  }

  async post<T>(path: string, body?: Object, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>(http.RequestMethod.POST, path, body, options);
  }

  async put<T>(path: string, body?: Object, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>(http.RequestMethod.PUT, path, body, options);
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>(http.RequestMethod.DELETE, path, undefined, options);
  }
}

export const httpClient = new HttpClient();
