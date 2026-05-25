export interface Device {
  id: number;
  name: string;
  model: string | null;
  category_id: number;
  category_name?: string;
  created_at: string;
  updated_at: string;
}

export interface DeviceCreateRequest {
  name: string;
  model?: string;
  category_id: number;
}

export interface DeviceUpdateRequest {
  name?: string;
  model?: string;
  category_id?: number;
}

export interface LogEntry {
  id: number;
  admin_username: string;
  method: string;
  path: string;
  status_code: number;
  duration_ms: number;
  ip_address: string;
  created_at: string;
}
