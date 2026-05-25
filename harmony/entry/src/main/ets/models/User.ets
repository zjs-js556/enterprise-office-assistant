export interface User {
  admin_id: number;
  username: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  admin_id: number;
  username: string;
  role: string;
}
