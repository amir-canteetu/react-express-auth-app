import { useEffect } from "react";
import axios from 'axios';
import appConfig from '../config';
import { useAuth } from '../context/AuthContext';

export const axiosInstance = axios.create({
  baseURL: appConfig.apiBaseUrl,
});

const useAxiosWithRefresh = () => {
  const { accessToken, refreshToken, logout } = useAuth();

  // Attach the request interceptor only once and ensure it's updated when `accessToken` changes
  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(

      (config) => {
        console.log("Request interceptor called with accessToken:", accessToken);
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
          config.withCredentials = true;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken]);

  useEffect(() => {
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log("Response interceptor triggered", error.response?.status);
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          console.log("Attempting token refresh...");
          try {
            const newAccessToken = await refreshToken();
            if (!newAccessToken) {throw new Error("Token refresh failed");}

            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            console.error("Failed to refresh access token:", refreshError);
            logout();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [refreshToken, logout]);

  return axiosInstance;
};

export default useAxiosWithRefresh;
