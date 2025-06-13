import { Gender } from "@/constants/gender";
import { ErrorResponse, ForgotPasswordResponse, LoginResponse, RegisterResponse, ResetPasswordResponse } from "./authResponse";

export type AuthState = {
  authenticated: boolean;
  token: string | null;
  emailVerificationToken?: string;
};

export type UserRegistrationInfo = {
  name: string;
  birth_date: Date;
  gender: Gender;
  email: string;
  password: string;
  c_password: string;
  step: number;
};
export interface AuthProps {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
  onSignUp: (
    name: string,
    email: string,
    password: string,
    c_password: string,
    birth_date: Date,
    gender: Gender
  ) => Promise<RegisterResponse | ErrorResponse>;
  verifyEmail: (email: string, code: string) => Promise<RegisterResponse | ErrorResponse>;
  resetPassword: (
    email: string,
    password: string,
    password_confirmation: string,
    password_reset_code: string
  ) => Promise<ForgotPasswordResponse | ErrorResponse>;
  sendVerifyEmailCode: (email: string) => Promise<ResetPasswordResponse | ErrorResponse>
  onLogIn: (email: string, password: string) => Promise<LoginResponse | ErrorResponse>;
  onLogOut: () => void;
  userRegistrationInfo: UserRegistrationInfo;
  setUserRegistrationInfo: React.Dispatch<React.SetStateAction<UserRegistrationInfo>>;
}
