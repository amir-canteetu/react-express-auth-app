import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../apiService';

const Logout = () => {
  const { logout } = useAuth(); // Get logout function from AuthContext
  const navigate = useNavigate(); // Get navigate function from React Router

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Make a POST request to the Express API to log out
        api.post('/auth/logout', {});

        // Call the logout function from the AuthContext to reset the auth state
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
