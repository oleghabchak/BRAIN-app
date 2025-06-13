export interface SuccessData {
  token: string;
  name: string;
}
export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  email_verification_token?: string;
}
export interface RegisterResponse {
  success: SuccessData;
  message: string;
  email_verification_code: string;
}

export interface LoginResponse {
  success: boolean;
  data: SuccessData;
  message: string;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  token: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  password_reset_code: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string | Record<string, string[]>;
}

export interface SendVerifyEmailCodeResponse {
  success: boolean;
  message: string;
  email_verification_code: number;
}
