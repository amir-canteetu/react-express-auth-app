import { useState, useEffect } from "react";
import useAxiosWithRefresh from "../api/apiService";
import { useAuth } from "../context/AuthContext";

export function useUserProfile() {
  const { user }              = useAuth(); 
  const axiosInstance         = useAxiosWithRefresh();
  const [profile, setProfile] = useState(null);
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);  
        const response = await axiosInstance.get('/app/profile', { params: { id: user.id } });
        console.log('client/src/api/users.jsx response:', response);
        setProfile(response.data);
        setError(null);  
      } catch (err) {
        setError(err);  
      } finally {
        setLoading(false); 
      }
    };

    fetchUserProfile();
  }, [axiosInstance, user.id]);

  return { profile, error, loading };  
}
