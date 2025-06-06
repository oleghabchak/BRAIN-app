import { AxiosInstance } from "axios";
import { createAxiosClient } from "./client";
import type { ApiResult } from "./types";

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = createAxiosClient();
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<ApiResult<T>> {
    try {
      const response = await this.client.get<T>(url, { params });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.toString() };
    }
  }

  async post<T, D = any>(url: string, data?: D, headers?: any): Promise<ApiResult<T>> {
    try {
      const response = await this.client.post<T>(url, data, {
        headers,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.toString() };
    }
  }

  async put<T, D = any>(url: string, data: D): Promise<ApiResult<T>> {
    try {
      const response = await this.client.put<T>(url, data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.toString() };
    }
  }

  async patch<T, D = any>(url: string, data: D): Promise<ApiResult<T>> {
    try {
      const response = await this.client.patch<T>(url, data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.toString() };
    }
  }

  async delete<T>(url: string): Promise<ApiResult<T>> {
    try {
      const response = await this.client.delete<T>(url);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.toString() };
    }
  }
}

export const api = new ApiService();
