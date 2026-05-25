import { httpClient, HttpResponse } from './http';
import { LogEntry } from '../models/Device';

export class LogService {
  static async getList(page: number = 1, pageSize: number = 20): Promise<HttpResponse<LogEntry[]>> {
    const params: Record<string, string | number> = { 'page': page, 'page_size': pageSize };
    return httpClient.get<LogEntry[]>('/logs', { params: params });
  }
}
