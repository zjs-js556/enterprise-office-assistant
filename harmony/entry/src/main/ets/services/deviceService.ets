import { httpClient, HttpResponse } from './http';
import { Device, DeviceCreateRequest, DeviceUpdateRequest } from '../models/Device';

export class DeviceService {
  static async getList(categoryId?: number): Promise<HttpResponse<Device[]>> {
    const params: Record<string, string | number> = {};
    if (categoryId && categoryId > 0) {
      params['category_id'] = categoryId;
    }
    return httpClient.get<Device[]>('/devices', { params });
  }

  static async getById(id: number): Promise<HttpResponse<Device>> {
    return httpClient.get<Device>(`/devices/${id}`);
  }

  static async create(data: DeviceCreateRequest): Promise<HttpResponse<Device>> {
    return httpClient.post<Device>('/devices', data);
  }

  static async update(id: number, data: DeviceUpdateRequest): Promise<HttpResponse<Device>> {
    return httpClient.put<Device>(`/devices/${id}`, data);
  }

  static async delete(id: number): Promise<HttpResponse<null>> {
    return httpClient.delete<null>(`/devices/${id}`);
  }
}
