import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { triggerSignOut } from "../context/AuthContext";

const BASE_URL = Platform.select({
  android: "http://114.55.171.7/api/v1",
  default: "http://114.55.171.7/api/v1",
});

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { response } = error;
    if (response) {
      const data = response.data;
      if (response.status === 401 || data?.code === 401) {
        triggerSignOut();
      }
      return Promise.reject(data || { code: -1, message: "请求失败", data: null });
    }
    return Promise.reject({ code: -1, message: "网络错误", data: null });
  }
);

export default http;
