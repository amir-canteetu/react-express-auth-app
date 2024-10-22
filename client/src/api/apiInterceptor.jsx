import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const useAxiosWithRefresh = () => {
  const { accessToken, refreshToken, logout } = useAuth();

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000', // Base API URL
  });

  // Set up a request interceptor to attach the access token to each request
  axiosInstance.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Set up a response interceptor to handle token expiration
  axiosInstance.interceptors.response.use(
    (response) => response, // If the response is successful, just return it
    async (error) => {
      const originalRequest = error.config;

      // If we get a 401 error, try to refresh the token
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Prevent infinite loops

        try {
          const newAccessToken = await refreshToken(); // Attempt to refresh token
          axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`; // Set the new token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest); // Retry the original request
        } catch (refreshError) {
          logout(); // Log out if the token refresh fails
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxiosWithRefresh;
