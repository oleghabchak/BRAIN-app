import { ErrorResponse, LoginResponse, RegisterResponse } from "./authResponse";

export type AuthState = {
  authenticated: boolean | null;
  token: string | null;
};

export interface AuthProps {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
  onSignUp: (
    name: string,
    email: string,
    password: string,
    c_password: string
  ) => Promise<RegisterResponse | ErrorResponse>;
  onLogIn: (email: string, password: string) => Promise<LoginResponse | ErrorResponse>;
  onLogOut: () => void;
}
