import { createContext, useContext, useEffect, useState } from 'react';

import { api, SecureStoreDelete, SecureStoreGet, SecureStoreSave } from '@/services';
import { clearToken, setToken } from '@/services/api/client';
import { AuthProps, AuthState } from '@/types/authContext';
import { LoginResponse, RegisterResponse } from '@/types/authResponse';

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

  const signUp = async (name: string, email: string, password: string, c_password: string) => {
    try {
      const response = await api.post<RegisterResponse>('/register', {
        name,
        email,
        password,
        c_password,
      });

      if (response.success && response.data) {
        const user = response.data;

        setAuthState({
          ...authState,
          token: user.success.token,
        });

        setToken(user.success.token);
        await SecureStoreSave('token', user.success.token);

        return user;
      } else {
        return { success: false, message: 'Signup failed' };
      }
    } catch (error) {
      console.error(error);
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
      if (response && response.success) {
        return response.data;
      } else {
        if (response.message !== '[object Object]') return { success: false, message: response?.message };
        return { success: false, message: 'Email verification failed' };
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
        return { success: false, message: 'Email or password is not correct' };
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

  const value = {
    onSignUp: signUp,
    onLogIn: logIn,
    onLogOut: logOut,
    verifyEmail,
    authState,
    setAuthState,
    userRegistrationInfo,
    setUserRegistrationInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
