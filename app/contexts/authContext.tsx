import { createContext, useContext, useEffect, useState } from 'react';

import { api, SecureStoreDelete, SecureStoreGet, SecureStoreSave } from '@/services';
import { clearToken, setToken } from '@/services/api/client';
import { AuthProps, AuthState } from '@/types/authContext';
import { LoginResponse, RegisterResponse, ForgotPasswordResponse, VerifyOtpResponse, ResetPasswordResponse } from '@/types/authResponse'; // Import new interfaces

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    authenticated: null,
    token: null,
  });

  const [userRegistrationInfo, setUserRegistrationInfo] = useState({
    name: '',
    birth_date: new Date(),
    gender: '',
    email: '',
    password: '',
    c_password: '',
    step: 1,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const token = await SecureStoreGet('token');

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

  const GENDER_MAPPING: { [key: string]: number } = {
  "Female": 1,
  "Male": 2,
  "Prefer not to say": 3, 
};
const signUp = async (name: string, email: string, password: string, c_password: string, birth_date: Date, gender: string) => {
  try {
    if (!(birth_date instanceof Date)) {
      console.error("birth_date is not a Date object:", birth_date);
      return { success: false, message: 'Invalid birth date format.' };
    }
    const formattedBirthDate = birth_date.toISOString().split('T')[0];
    console.log('Formatted Birth Date:', formattedBirthDate);

    const genderId = GENDER_MAPPING[gender];

    if (typeof genderId === 'undefined') {
      console.error('Invalid gender string received:', gender);
      return { success: false, message: 'Invalid gender selected.' };
    }

    const requestPayload = {
      name,
      email,
      password,
      c_password,
      gender: genderId,
      dob: formattedBirthDate,
    };
    console.log('Register Request Payload:', requestPayload);

    const response = await api.post<RegisterResponse>('/register', requestPayload);
    console.log('API Response for /register:', response);
    if (response.success && response.data?.success) {
      const user = response.data.success;

      setAuthState({
        ...authState,
        token: user.token,
      });

      setToken(user.token);
      await SecureStoreSave('token', user.token);
      console.log('User registration successful:', user);
      return { success: true, ...user, message: response.data.message, email_verification_token: response.data.email_verification_token };
    } else {
      return { success: false, message: response?.data?.message || 'Signup failed' };
    }
  } catch (error) {
    console.error("Error during registration:", error);
    return { success: false, message: 'Signup failed' };
  }
};

  const verifyEmail = async (email: string, code: string) => {
    if (!code) {
      return { success: false, message: "Verification code can't be empty" };
    }
    try {
      const response = await api.post<RegisterResponse>('/verify-email', {
        email,
        token: code,
      });
      if (response?.success) {
        return { success: true, message: response.message ?? 'Email verified successfully!' };
      } else {
        return { success: false, message: response?.message ?? 'Email verification failed' };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Email verification failed' };
    }
  };

  const logIn = async (email: string, password: string) => {
    const message = validateEmail(email);
    if (message) {
      return { success: false, message };
    }
    try {
      const response = await api.post<LoginResponse>('/login', {
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
        await SecureStoreSave('token', user.token);

        return { success: true, ...user, message: response.data.message };
      } else {
        return { success: false, message: response?.message || 'Email or password is not correct' };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Something goes wrong' };
    }
  };

  const validateEmail = (authEmail: string) => {
    if (authEmail.length === 0) return "Email can't be blank";
    if (authEmail.length < 6) return 'Email must be at least 6 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)) return 'Email must be a valid email address (ex. john@mail.com)';
    return '';
  };

  const logOut = async () => {
    await SecureStoreDelete('token');
    clearToken();

    setAuthState({
      token: null,
      authenticated: false,
    });
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await api.post<ForgotPasswordResponse>('/forgot-password', { email });
      if (response.success) {
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response?.message || 'Failed to send password reset code.' };
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, message: 'Failed to send password reset code.' };
    }
  };

  const verifyForgotPasswordOtp = async (email: string, otp: string) => {
    try {
      const response = await api.post<VerifyOtpResponse>('/verify-email', { email, otp });
      if (response.success) {
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response?.message || 'Invalid or expired OTP.' };
      }
    } catch (error) {
      console.error('Verify forgot password OTP error:', error);
      return { success: false, message: 'Invalid or expired OTP.' };
    }
  };

  const resetPassword = async (email: string, otp: string, password: string) => {
    try {
      const response = await api.post<ResetPasswordResponse>('/reset-password', { email, otp, password });
      if (response.success) {
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response?.message || 'Failed to reset password.' };
      }
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, message: 'Failed to reset password.' };
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