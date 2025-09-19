import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
const UserDataContext = createContext();
const cookies = new Cookies();
export const UserDataProvider = ({ children }) => {
//set data here to see user data after refreshing website
  const [data, setData] = useState({}); 
  useEffect(() => {
    const token = cookies.get("TOKEN");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setData({
          username: decoded.userName,
          email: decoded.userEmail,
          role: decoded.userRole
        });
      } catch (err) {
        console.error("Incorrect token", err);
      }
    }
  }, []); 

   const logout = () => {
    cookies.remove("TOKEN"); 
    setData({}); 
  };

  return (
    <UserDataContext.Provider value={{ data, setData, logout}}>
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