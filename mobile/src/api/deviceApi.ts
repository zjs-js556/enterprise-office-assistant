import http from "./http";
import type { ApiResponse, Device, DeviceFormData } from "../types";

export function getDevicesApi(categoryId?: number) {
  return http.get("/devices", {
    params: categoryId ? { category_id: categoryId } : undefined,
  }) as Promise<ApiResponse<Device[]>>;
}

export function getCategoryDevicesApi(categoryId: number) {
  return http.get(`/categories/${categoryId}/devices`) as Promise<ApiResponse<Device[]>>;
}

export function createDeviceApi(data: DeviceFormData) {
  return http.post("/devices", data) as Promise<ApiResponse<Device>>;
}

export function updateDeviceApi(id: number, data: Partial<DeviceFormData>) {
  return http.put(`/devices/${id}`, data) as Promise<ApiResponse<Device>>;
}

export function deleteDeviceApi(id: number) {
  return http.delete(`/devices/${id}`) as Promise<ApiResponse<null>>;
}
