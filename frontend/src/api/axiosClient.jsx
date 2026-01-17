import axios from 'axios';

// Create an axios instance with default configurations
const axiosClient = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

//Interceptors
export const requestInterceptor = (logout, navigate) => {
  axiosClient.interceptors.response.use(
    (response) => response,
    async (error) =>{
      // Handle 401
      if(error.response && error.response.status === 401){
        alert("Sesja wygasła, zaloguj się ponownie");
        if(logout) logout();
        if(navigate) navigate('/login');
        return Promise.reject(error);
      }
      // Handle 403
      if(error.response && error.response.status === 403){
        alert("Nie masz dostępu do tego zasobu");
        if(navigate) navigate('/');
        return Promise.reject(error);
      }
      
    }
  )
}

export default axiosClient;