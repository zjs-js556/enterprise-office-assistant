import http from "./http";
import type { ApiResponse, LoginData } from "../types";

export function loginApi(username: string, password: string) {
  return http.post("/auth/login", { username, password }) as Promise<
    ApiResponse<LoginData>
  >;
}
