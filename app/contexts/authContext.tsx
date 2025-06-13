import { createContext, useContext, useEffect, useState } from "react";

import { api, SecureStoreDelete, SecureStoreGet, SecureStoreSave } from "@/services";
import { clearToken, setToken } from "@/services/api/client";
import { AuthProps, AuthState } from "@/types/authContext";
import {
  ApiResponse,
  SuccessData,
  LoginResponse,
  RegisterResponse,
  ResetPasswordResponse,
  VerifyEmailResponse,
  SendVerifyEmailCodeResponse,
} from "@/types/authResponse";

import { Gender, GENDER_MAPPING } from "@/constants/gender";

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    authenticated: false,
    token: null,
  });

  const [userRegistrationInfo, setUserRegistrationInfo] = useState({
    name: "",
    birth_date: new Date(),
    gender: "",
    email: "",
    password: "",
    c_password: "",
    step: 1,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const authInfo = await SecureStoreGet("authInfo");
      const parsedAuthInfo = JSON.parse(authInfo ?? "");

      if (parsedAuthInfo) {
        const { token, authenticated } = parsedAuthInfo;
        setToken(token);

        setAuthState({
          token,
          authenticated,
        });
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (
    name: string,
    email: string,
    password: string,
    c_password: string,
    birth_date: Date,
    gender: Gender
  ): Promise<ApiResponse<SuccessData>> => {
    try {
      if (!(birth_date instanceof Date)) {
        console.error("birth_date is not a Date object:", birth_date);
        return { success: false, message: "Invalid birth date format." };
      }
      const formattedBirthDate = birth_date.toISOString().split("T")[0];

      const requestPayload = {
        name,
        email,
        password,
        c_password,
        gender: GENDER_MAPPING[gender],
        dob: formattedBirthDate,
      };

      const response = await api.post<RegisterResponse>("/register", requestPayload);

      console.log(response.data?.email_verification_code);

      if (response.success && response.data?.success?.token) {
        const user = response.data.success;

        setAuthState({
          ...authState,
          token: user.token,
        });
        setToken(user.token);

        const authInfo = { token: user.token, authenticated: false };
        await SecureStoreSave("authInfo", JSON.stringify(authInfo));

        return {
          success: true,
          message: response.data.message || "Registration successful!",
          data: user,
        };
      } else {
        return { success: false, message: response.data?.message || "Signup failed" };
      }
    } catch (error) {
      console.error("Error during registration:", error);
      return { success: false, message: "Signup failed" };
    }
  };

  const verifyEmail = async (email: string, otpCode: string): Promise<ApiResponse<undefined>> => {
    if (!otpCode) {
      return { success: false, message: "Verification code can't be empty" };
    }

    try {
      const response = await api.post<VerifyEmailResponse>("/verify-email", {
        email,
        email_verification_code: Number(otpCode),
      });

      if (response.success) {
        setAuthState((prev) => ({ ...prev, emailVerificationToken: undefined }));
        const authInfo = { token: authState.token, authenticated: true };
        await SecureStoreSave("authInfo", JSON.stringify(authInfo));

        return { success: true, message: response.message ?? "Email verified successfully!" };
      } else {
        return { success: false, message: response.message ?? "Email verification failed" };
      }
    } catch (error) {
      console.error("Error during email verification:", error);
      return { success: false, message: "Email verification failed" };
    }
  };

  const logIn = async (email: string, password: string): Promise<ApiResponse<SuccessData>> => {
    const message = validateEmail(email);
    if (message) {
      return { success: false, message };
    }
    try {
      const response = await api.post<LoginResponse>("/login", {
        email,
        password,
      });

      if (response.success && response.data?.data?.token) {
        const user = response.data.data;

        setAuthState({
          token: user.token,
          authenticated: true,
        });

        setToken(user.token);
        const authInfo = { token: user.token, authenticated: true };
        await SecureStoreSave("authInfo", JSON.stringify(authInfo));

        return { success: true, message: response.data.message, data: user };
      } else {
        return { success: false, message: response.data?.message || "Email or password is not correct" };
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
    await SecureStoreDelete("authInfo");
    clearToken();

    setAuthState({
      token: null,
      authenticated: false,
    });
  };

  const resetPassword = async (
    email: string,
    password: string,
    password_confirmation: string,
    password_reset_code: string
  ): Promise<ApiResponse<ResetPasswordResponse>> => {
    try {
      const response = await api.post<ResetPasswordResponse>("/reset-password", {
        email,
        password,
        password_confirmation,
        password_reset_code,
      });
      if (response.success && response.data?.token) {
        const authInfo = { token: response.data.token, authenticated: true };
        await SecureStoreSave("authInfo", JSON.stringify(authInfo));
        setToken(response.data?.token);
        return { success: true, message: response.message || "Password reset successfully!" };
      } else {
        return { success: false, message: response.message || "Failed to reset password." };
      }
    } catch (error) {
      console.error("Reset password error:", error);
      return { success: false, message: "Failed to reset password." };
    }
  };

  const sendVerifyEmailCode = async (email: string): Promise<ApiResponse<SendVerifyEmailCodeResponse>> => {
    try {
      const response = await api.post<ResetPasswordResponse>("/send-verify-email", {
        email,
      });
      if (response.success && response.data?.token) {
        return { success: true, message: response.message || "Verification code sent successfully!" };
      } else {
        return { success: false, message: response.message || "Failed to send verification code." };
      }
    } catch (error) {
      console.error("Send verify email code error:", error);
      return { success: false, message: "Failed to send verification code." };
    }
  };

  const value = {
    onSignUp: signUp,
    onLogIn: logIn,
    onLogOut: logOut,
    verifyEmail,
    resetPassword,
    sendVerifyEmailCode,
    authState,
    setAuthState,
    userRegistrationInfo,
    setUserRegistrationInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
