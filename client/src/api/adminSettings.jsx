import { useState, useEffect } from "react";
import useAxiosWithRefresh from "./apiService";
import { useAuth } from "../context/AuthContext";

export function useAdminSettings() {
  const { user }                            = useAuth(); 
  const axiosInstance                       = useAxiosWithRefresh();
  const [adminSettings, setAdminSettings]   = useState(null);
  const [error, setError]                   = useState(null);
  const [loading, setLoading]               = useState(true);  

  useEffect(() => {
    const fetchAdminSettings = async () => {
      try {
        setLoading(true);  
        const response = await axiosInstance.get('/app/settings', { params: { id: user.id } });
        setAdminSettings(response.data);
        setError(null);  
      } catch (err) {
        setError(err);  
      } finally {
        setLoading(false); 
      }
    };

    fetchAdminSettings();
  }, [axiosInstance, user.id]);

  return { adminSettings, error, loading };  
}
