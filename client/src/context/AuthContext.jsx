import { createContext, useContext, useState, useEffect } from 'react';
import api from '../apiService';

const AuthContext     = createContext();
export const useAuth  = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  const [authState, setAuthState] = useState({
      isAuthenticated: false,
      user: null
  });
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {

      const checkAuth = async () => { 
        try {
          const response = await api.get('/auth/verify-token');
          setAuthState({
            isAuthenticated: true,
            user: response.data.user
          });
          setisLoading(false);
        } catch (err) {
          setAuthState({
            isAuthenticated: false,
            user: null
          });
          setisLoading(false);
        }
      };
      checkAuth();
  }, []);

  const login = ({ id, username, role }) => {
        try {
          setAuthState({
            isAuthenticated: true,
            user: { id, username, role }
          });
        } catch (err) {
          throw err;
        }
  };

  const logout = () => {
    try {
      setAuthState({
        isAuthenticated: false,
        user: null
      });
    } catch (err) {
      throw err;
    }
  };

  return <AuthContext.Provider value={{ ...authState, isLoading, login, logout }}>{children}</AuthContext.Provider>;
};
