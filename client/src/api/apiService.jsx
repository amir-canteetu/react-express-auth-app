import axios from 'axios';
import config from '../config';

export const axiosInstance = axios.create({
  baseURL: config.apiBaseUrl,  
  withCredentials: true
});

const api = (accessToken, refreshToken, logout) => {

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
    (response) => response, // Just return the response if it's successful
    async (error) => {
      const originalRequest = error.config;

      // If we get a 401 error, try to refresh the token
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Prevent infinite loops

        try {
          const newAccessToken = await refreshToken(); // Try to refresh token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest); // Retry the original request with the new token
        } catch (refreshError) {
          logout(); // Log out if the token refresh fails
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error); // If not a 401 error, reject the error
    }
  );

  return axiosInstance;
};

export default api;
