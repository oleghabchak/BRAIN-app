export interface SuccessData {
  token: string;
  name: string;
}

export interface RegisterResponse {
  success: SuccessData;
  message: string;
  email_verification_token: string;
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
export interface AuthResponse {
  success: boolean;
  data?: SuccessData;
  message?: string;
  email_verification_token?: string;
} 

export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}