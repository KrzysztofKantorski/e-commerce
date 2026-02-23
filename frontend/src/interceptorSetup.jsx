import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useData } from './Context/UserDataContext';
import { requestInterceptor } from './api/axiosClient';
export const InterceptorSetup = () => {
  const navigate = useNavigate();
  const { logout } = useData();

  useEffect(() => {
    requestInterceptor(logout, navigate);
  }, [logout, navigate]);

  return null; 
};