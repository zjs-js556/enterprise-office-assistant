import { httpClient, HttpResponse } from './http';
import { Category, CategoryCreateRequest, CategoryUpdateRequest } from '../models/Category';

export class CategoryService {
  static async getList(): Promise<HttpResponse<Category[]>> {
    return httpClient.get<Category[]>('/categories');
  }

  static async create(data: CategoryCreateRequest): Promise<HttpResponse<Category>> {
    return httpClient.post<Category>('/categories', data);
  }

  static async update(id: number, data: CategoryUpdateRequest): Promise<HttpResponse<Category>> {
    return httpClient.put<Category>(`/categories/${id}`, data);
  }

  static async delete(id: number): Promise<HttpResponse<null>> {
    return httpClient.delete<null>(`/categories/${id}`);
  }
}
