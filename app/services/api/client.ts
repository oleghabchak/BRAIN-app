import axios from "axios";

const API_BASE_URL = "https://www.brainsugar.co/api";

let token: string | null = null;

export const createAxiosClient = () => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
  });

  client.interceptors.request.use(
    async (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.log(`➡️ [${config.method?.toUpperCase()}] ${config.url}`);
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log("❌ API Error:", {
        url: error.config?.url,
        message: error.message,
        status: error.response?.status,
      });

      if (error.response?.status === 401) {
      }

      return Promise.reject(error?.response?.data?.message || "Something went wrong. Please try again.");
    }
  );

  return client;
};

export const setToken = (newToken: string) => {
  token = newToken;
};

export const clearToken = () => {
  token = null;
};
