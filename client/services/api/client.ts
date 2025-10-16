import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { ApiException } from "./types";

/**
 * Enhanced axios instance with interceptors and error handling
 */

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL:
        process.env.NEXT_PUBLIC_API_URL ||
        "https://lgu-ayuda-uvkd.onrender.com/api",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000, // 30 seconds
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // You can add auth tokens here if needed
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        return this.handleError(error);
      }
    );
  }

  private handleError(error: AxiosError) {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      const errorData = data as any;

      throw new ApiException(
        status,
        errorData?.message || "An error occurred",
        errorData?.errors
      );
    } else if (error.request) {
      // Request made but no response
      throw new ApiException(
        0,
        "No response from server. Please check your connection."
      );
    } else {
      // Something else happened
      throw new ApiException(
        0,
        error.message || "An unexpected error occurred"
      );
    }
  }

  // HTTP methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  // Get the raw axios instance if needed for special cases
  getAxiosInstance(): AxiosInstance {
    return this.instance;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
