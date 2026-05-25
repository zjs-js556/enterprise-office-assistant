export interface Employee {
  id: number;
  name: string;
  age: number;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeCreateRequest {
  name: string;
  age: number;
  email: string;
}

export interface EmployeeUpdateRequest {
  name?: string;
  age?: number;
  email?: string;
}
