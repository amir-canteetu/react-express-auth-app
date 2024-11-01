import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { axiosInstance } from '../api/apiService';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    accessToken: null,
    user: null,
  });

  const [authLoading, setAuthLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await axiosInstance.post('/auth/refresh-token', {}, { withCredentials: true });
      setAuthState({
        isAuthenticated: true,
        accessToken: response.data.accessToken,
        user: response.data.user,
      });
    } catch (error) {
      setAuthState({ isAuthenticated: false, user: null, accessToken: null });
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData) => {
    const { accessToken, id, username, role, email } = userData;
    setAuthState({
      isAuthenticated: true,
      accessToken,
      user: { id, username, role, email },
    });
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      accessToken: null,
    });
  };

  const refreshToken = async () => {
    try {
      const response = await axiosInstance.post('/auth/refresh-token', {}, { withCredentials: true });
      setAuthState(prevState => ({
        ...prevState,
        accessToken: response.data.accessToken,
      }));
      return response.data.accessToken;
    } catch (error) {
      console.error("Token refresh failed", error);
      logout();
    }
  };

  const value = useMemo(
    () => ({ ...authState, refreshToken, authLoading, login, logout }),
    [authState, refreshToken, authLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
