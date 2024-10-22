import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/apiService';

const AuthContext     = createContext();
export const useAuth  = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  const [authState, setAuthState] = useState({
          isAuthenticated: false,
          accessToken: null,  
          user: null,
  });

  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {

      const checkAuth = async () => { 
        try {
          const response = await api.get('/auth/verify-token');
          setAuthState({
            isAuthenticated: true,
            user: response.data.user,
            accessToken: response.data.accessToken
          });
          setisLoading(false);
        } catch (err) {
          setAuthState({
            isAuthenticated: false,
            user: null,
            accessToken: null
          });
          setisLoading(false);
        }
      };
      checkAuth();
  }, []);

  const login = (userData) => {

    const { accessToken, id, username, role, email  }  = userData;
    const user = { id, username, role, email };
    
        try {
          setAuthState({
            isAuthenticated: true,
            accessToken:  accessToken,
            user: user
          });
        } catch (err) {
          throw err;
        }
  };

  const logout = () => {
    try {
      setAuthState({
        isAuthenticated: false,
        user: null,
        accessToken: null
      });
    } catch (err) {
      throw err;
    }
  };

  return <AuthContext.Provider value={{ ...authState, isLoading, login, logout }}>{children}</AuthContext.Provider>;
};
