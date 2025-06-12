import { ErrorResponse, LoginResponse, RegisterResponse } from './authResponse';

export type AuthState = {
  authenticated: boolean | null;
  token: string | null;
  emailVerificationToken?: string; 
};

export type UserRegistrationInfo = {
  name: string;
  birth_date: Date;
  gender: string | number; 
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
    gender: string
  ) => Promise<RegisterResponse | ErrorResponse>;
  verifyEmail: (email: string, code: string) => Promise<RegisterResponse | ErrorResponse>; 
  onLogIn: (email: string, password: string) => Promise<LoginResponse | ErrorResponse>;
  onLogOut: () => void;
  userRegistrationInfo: UserRegistrationInfo;
  setUserRegistrationInfo: React.Dispatch<React.SetStateAction<UserRegistrationInfo>>;
}