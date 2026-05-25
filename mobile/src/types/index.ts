export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface LoginData {
  token: string;
  admin_id: number;
  username: string;
  role: string;
}

export interface Employee {
  id: number;
  name: string;
  age: number;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  device_count: number;
  created_at: string;
  updated_at: string;
}

export interface Device {
  id: number;
  name: string;
  model: string;
  category_id: number;
  created_at: string;
  updated_at: string;
}

export interface EmployeeFormData {
  name: string;
  age: string;
  email: string;
}

export interface CategoryFormData {
  name: string;
}

export interface DeviceFormData {
  name: string;
  model: string;
  category_id: number;
}

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  AIAssistant: undefined;
  TicketCreate: undefined;
  MyTickets: undefined;
  TicketDetail: { id: number };
  MessageNotifications: undefined;
  Profile: undefined;
  ErrorStates: undefined;
};

export type EmployeeStackParamList = {
  EmployeeList: undefined;
  EmployeeDetail: { id: number };
  EmployeeForm: { id?: number };
};

export type DeviceStackParamList = {
  DeviceList: undefined;
  DeviceForm: { id?: number };
};
