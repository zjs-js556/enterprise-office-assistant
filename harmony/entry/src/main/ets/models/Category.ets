export interface Category {
  id: number;
  name: string;
  device_count: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryCreateRequest {
  name: string;
}

export interface CategoryUpdateRequest {
  name: string;
}
