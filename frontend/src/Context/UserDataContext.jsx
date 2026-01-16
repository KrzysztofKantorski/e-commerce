import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UserDataContext = createContext();
export const UserDataProvider = ({ children }) => {
//set data here to see user data after refreshing website
  const [data, setData] = useState({}); 
  const [isAuthReady, setIsAuthReady] = useState(false);


    const checkAuth = async () => {
      try{
        const url = "http://localhost:3000/auth/me";
        const response = await axios.get(url);
        if(response.status == 200){
          setData({
          username: response.data.username,
          role: response.data.role,
          email: response.data.email
        });
        return true;
        }
      }
      catch(error){
        setData({});
        if(error.response?.status === 401){
          console.log("User not authenticated");
          setData({});
          return false;
        }
      }
      finally{
        setIsAuthReady(true);
      }
    }

  useEffect(() => {
    checkAuth();
  }, []); 

  const logout = async() => {
  try{
   const url = "http://localhost:3000/auth/logout";
   const data = await axios.post(url); 
   if(data.response?.status === 200){
     setData({});
   }
  }
  catch(error){
      if(error.response?.status === 500){
        console.error("Logout error:", error);
      }
  }
  };

  return (
    <UserDataContext.Provider value={{ data, setData, logout, isAuthReady, setIsAuthReady, checkAuth }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
};

export default UserDataContext;