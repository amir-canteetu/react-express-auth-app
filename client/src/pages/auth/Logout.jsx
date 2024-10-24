import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from  "../../api/apiService";

const Logout = () => {

  const { logout }  = useAuth(); // Get logout function from AuthContext
  const navigate    = useNavigate(); // Get navigate function from React Router
  
  useEffect(() => {
    const handleLogout = async () => {
      try {
        axiosInstance.post('/auth/logout', {});
        logout();
        navigate('/');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };

    handleLogout(); // Call the logout function when the component mounts
  }, [logout, navigate]);  

  return; // Ensure the user is redirected after logout
};

export default Logout;
