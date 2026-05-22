import http from "./http";
import type { ApiResponse, Category, CategoryFormData } from "../types";

export function getCategoriesApi() {
  return http.get("/categories") as Promise<ApiResponse<Category[]>>;
}

export function createCategoryApi(data: CategoryFormData) {
  return http.post("/categories", data) as Promise<ApiResponse<Category>>;
}

export function updateCategoryApi(id: number, data: CategoryFormData) {
  return http.put(`/categories/${id}`, data) as Promise<ApiResponse<Category>>;
}

export function deleteCategoryApi(id: number) {
  return http.delete(`/categories/${id}`) as Promise<ApiResponse<null>>;
}
