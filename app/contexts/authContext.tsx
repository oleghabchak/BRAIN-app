import { api, SecureStoreDelete, SecureStoreGet, SecureStoreSave } from "@/services";
import { createContext, useContext, useEffect, useState } from "react";
import { setToken, clearToken } from "@/services/api/client";
import { LoginResponse, RegisterResponse } from "@/types/authResponse";
import { AuthProps, AuthState } from "@/types/authContext";

const AuthContext = createContext<Partial<AuthProps>>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    authenticated: null,
    token: null,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const token = await SecureStoreGet("token");

      if (token) {
        setToken(token);

        setAuthState({
          token,
          authenticated: true,
        });
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (name: string, email: string, password: string, c_password: string) => {
    try {
      const response = await api.post<RegisterResponse>("/register", {
        name,
        email,
        password,
        c_password,
      });

      if (response.success && response.data) {
        const user = response.data;

        setAuthState({
          token: user.success.token,
          authenticated: true,
        });

        setToken(user.success.token);
        await SecureStoreSave("token", user.success.token);

        return user;
      } else {
        return { success: false, message: "Signup failed" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "Signup failed" };
    }
  };

  const logIn = async (email: string, password: string) => {
    const message = validateEmail(email);
    if (message) {
      return { success: false, message };
    }
    try {
      const response = await api.post<LoginResponse>("/login", {
        email,
        password,
      });

      if (response.success && response.data) {
        const { data: user } = response.data;

        setAuthState({
          token: user.token,
          authenticated: true,
        });

        setToken(user.token);
        await SecureStoreSave("token", user.token);

        return { success: true, ...user, message: response.data.message };
      } else {
        return { success: false, message: "Email or password is not correct" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "Something goes wrong" };
    }
  };

  const validateEmail = (authEmail: string) => {
    if (authEmail.length === 0) return "Email can't be blank";
    if (authEmail.length < 6) return "Email must be at least 6 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)) return "Email must be a valid email address (ex. john@mail.com)";
    return "";
  };

  const logOut = async () => {
    await SecureStoreDelete("token");
    clearToken();

    setAuthState({
      token: null,
      authenticated: false,
    });
  };

  const value = {
    onSignUp: signUp,
    onLogIn: logIn,
    onLogOut: logOut,
    authState,
    setAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
