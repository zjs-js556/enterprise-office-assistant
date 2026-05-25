import { httpClient, HttpResponse } from './http';
import { Employee, EmployeeCreateRequest, EmployeeUpdateRequest } from '../models/Employee';
import { PaginatedData } from '../models/ApiResponse';

export class EmployeeService {
  static async getList(page: number = 1, pageSize: number = 20): Promise<HttpResponse<PaginatedData<Employee>>> {
    return httpClient.get<PaginatedData<Employee>>('/employees', {
      params: { page, page_size: pageSize }
    });
  }

  static async getById(id: number): Promise<HttpResponse<Employee>> {
    return httpClient.get<Employee>(`/employees/${id}`);
  }

  static async create(data: EmployeeCreateRequest): Promise<HttpResponse<Employee>> {
    return httpClient.post<Employee>('/employees', data);
  }

  static async update(id: number, data: EmployeeUpdateRequest): Promise<HttpResponse<Employee>> {
    return httpClient.put<Employee>(`/employees/${id}`, data);
  }

  static async delete(id: number): Promise<HttpResponse<null>> {
    return httpClient.delete<null>(`/employees/${id}`);
  }
}
