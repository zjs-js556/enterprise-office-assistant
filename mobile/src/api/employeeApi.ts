import http from "./http";
import type { ApiResponse, Employee, EmployeeFormData } from "../types";

export function getEmployeesApi(page = 1, pageSize = 20) {
  return http.get("/employees", { params: { page, page_size: pageSize } }) as Promise<
    ApiResponse<{ items: Employee[]; total: number; page: number; page_size: number }>
  >;
}

export function getEmployeeApi(id: number) {
  return http.get(`/employees/${id}`) as Promise<ApiResponse<Employee>>;
}

export function createEmployeeApi(data: EmployeeFormData) {
  return http.post("/employees", data) as Promise<ApiResponse<Employee>>;
}

export function updateEmployeeApi(id: number, data: Partial<EmployeeFormData>) {
  return http.put(`/employees/${id}`, data) as Promise<ApiResponse<Employee>>;
}

export function deleteEmployeeApi(id: number) {
  return http.delete(`/employees/${id}`) as Promise<ApiResponse<null>>;
}
