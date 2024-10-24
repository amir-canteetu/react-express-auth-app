import { createContext, useContext, useState, useEffect } from 'react';
import { axiosInstance } from '../api/apiService';

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
          const response = await axiosInstance.post('/auth/refresh-token', {}, { withCredentials: true, });
          setAuthState({
            isAuthenticated: true,
            accessToken:  response.data.accessToken,
            user: response.data.user,
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

  const refreshToken = async () => {
    try {
      const response = await axiosInstance.post('/auth/refresh-token', {}, { withCredentials: true, });
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

  return <AuthContext.Provider value={{ ...authState, refreshToken, isLoading, login, logout }}>{children}</AuthContext.Provider>;
};
