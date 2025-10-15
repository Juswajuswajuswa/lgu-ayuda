/**
 * Common API types and interfaces
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export class ApiException extends Error {
  constructor(
    public status: number,
    public message: string,
    public errors?: Record<string, string>
  ) {
    super(message);
    this.name = "ApiException";
  }
}
