export interface SuccessResponse<T> {
  message: string;
  data: T;
}

export interface ErrorResponse {
  error: string;
}

export interface AuthResponse {
  message: string;
  accessToken?: string;
}
