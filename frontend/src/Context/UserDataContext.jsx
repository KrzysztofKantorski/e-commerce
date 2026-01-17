import React, { createContext, useState, useContext, useEffect } from 'react';
import auth from '../api/auth';
const UserDataContext = createContext();
export const UserDataProvider = ({ children }) => {
//set data here to see user data after refreshing website
  const [data, setData] = useState({}); 
  const [isAuthReady, setIsAuthReady] = useState(false);
  const checkAuth = async () => {
      try{
      const userData = await auth.checkAuth();
      if(userData && userData.username){
        setData({
          username: userData.username,
          role: userData.role,
          email: userData.email
        });
        return true;
        }
      }
      catch(error){
        setData({});
        console.log(error.message)
        if(error.response?.status === 401){
          console.log("User not authenticated");
          setData({});
          return false;
        }
        return false;
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
   await auth.logout(); 
   setData({});
   
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