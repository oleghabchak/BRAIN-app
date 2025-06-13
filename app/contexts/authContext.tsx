import { createContext, useContext, useEffect, useState } from "react";

import { api, SecureStoreDelete, SecureStoreGet, SecureStoreSave } from "@/services";
import { clearToken, setToken } from "@/services/api/client";
import { AuthProps, AuthState } from "@/types/authContext";
import {
  ApiResponse,
  AuthSuccessData,
  ForgotPasswordResponse,
  LoginResponse,
  RegisterResponse,
  ResetPasswordResponse,
  VerifyOtpResponse,
} from "@/types/authResponse";

import { GENDER_MAPPING } from "@/constants/auth";

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    authenticated: false,
    token: null,
    emailVerificationToken: undefined,
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

  const signUp = async (
    name: string,
    email: string,
    password: string,
    c_password: string,
    birth_date: Date,
    gender: string
  ): Promise<ApiResponse<AuthSuccessData>> => {
    try {
      if (!(birth_date instanceof Date)) {
        console.error("birth_date is not a Date object:", birth_date);
        return { success: false, message: "Invalid birth date format." };
      }
      const formattedBirthDate = birth_date.toISOString().split("T")[0];

      const genderId = GENDER_MAPPING[gender];

      if (typeof genderId === "undefined") {
        console.error("Invalid gender string received:", gender);
        return { success: false, message: "Invalid gender selected." };
      }

      const requestPayload = {
        name,
        email,
        password,
        c_password,
        gender: genderId,
        dob: formattedBirthDate,
      };

      const response = await api.post<RegisterResponse>("/register", requestPayload);

      if (response.success && response.data?.success?.token) {
        // response.data.success is now AuthSuccessData
        const user = response.data.success;
        const emailVerificationToken = response.data.email_verification_token;

        setAuthState({
          ...authState,
          token: user.token,
          emailVerificationToken: emailVerificationToken,
        });

        setToken(user.token);
        await SecureStoreSave("token", user.token);

        // Return the consistent ApiResponse structure
        return {
          success: true,
          message: response.data.message || "Registration successful!",
          data: user,
          email_verification_token: emailVerificationToken,
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
      const response = await api.post<VerifyOtpResponse>("/verify-email", {
        email,
        email_verification_code: Number(otpCode),
      });

      if (response.success) {
        setAuthState((prev) => ({ ...prev, emailVerificationToken: undefined }));
        return { success: true, message: response.message ?? "Email verified successfully!" };
      } else {
        return { success: false, message: response.message ?? "Email verification failed" };
      }
    } catch (error) {
      console.error("Error during email verification:", error);
      return { success: false, message: "Email verification failed" };
    }
  };

  const logIn = async (email: string, password: string): Promise<ApiResponse<AuthSuccessData>> => {
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
        // Access nested data.data as per your previous LoginResponse
        const user = response.data.data;

        setAuthState({
          token: user.token,
          authenticated: true,
        });

        setToken(user.token);
        await SecureStoreSave("token", user.token);

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
    await SecureStoreDelete("token");
    clearToken();

    setAuthState({
      token: null,
      authenticated: false,
    });
  };

  const forgotPassword = async (email: string): Promise<ApiResponse<undefined>> => {
    try {
      const response = await api.post<ForgotPasswordResponse>("/forgot-password", { email });
      if (response.success) {
        return { success: true, message: response.message || "Password reset code sent!" };
      } else {
        return { success: false, message: response.message || "Failed to send password reset code." };
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      return { success: false, message: "Failed to send password reset code." };
    }
  };

  const verifyForgotPasswordOtp = async (email: string, otp: string): Promise<ApiResponse<undefined>> => {
    try {
      const response = await api.post<VerifyOtpResponse>("/verify-email", { email, otp });
      if (response.success) {
        return { success: true, message: response.message || "OTP verified successfully!" };
      } else {
        return { success: false, message: response.message || "Invalid or expired OTP." };
      }
    } catch (error) {
      console.error("Verify forgot password OTP error:", error);
      return { success: false, message: "Invalid or expired OTP." };
    }
  };

  const resetPassword = async (email: string, otp: string, password: string): Promise<ApiResponse<undefined>> => {
    try {
      const response = await api.post<ResetPasswordResponse>("/reset-password", { email, otp, password });
      if (response.success) {
        return { success: true, message: response.message || "Password reset successfully!" };
      } else {
        return { success: false, message: response.message || "Failed to reset password." };
      }
    } catch (error) {
      console.error("Reset password error:", error);
      return { success: false, message: "Failed to reset password." };
    }
  };

  const value = {
    onSignUp: signUp,
    onLogIn: logIn,
    onLogOut: logOut,
    verifyEmail,
    forgotPassword,
    verifyForgotPasswordOtp,
    resetPassword,
    authState,
    setAuthState,
    userRegistrationInfo,
    setUserRegistrationInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
