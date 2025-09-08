import React from 'react'
import { useState, useEffect } from 'react'
import {useNavigate} from "react-router"
import axios from "axios";
import Cookies from "universal-cookie";
import LoadingData from '@/components/handleData/LoadingData';
import { jwtDecode } from "jwt-decode";
import {useData} from "../Context/UserDataContext"
const cookies = new Cookies();


function LoginSuccess() {
    const { data, setData } = useData();
    const [error, setError] = useState("");
  
    const navigate = useNavigate()
  const token = cookies.get("TOKEN");
   
   

    useEffect(() => {

   
    if(!token){
    navigate("/Login");
    }
    const decoded = jwtDecode(token);
   
   
    // set configurations for the API call here
    const header = {
        Authorization: `Bearer ${token}`,
    }

    const verify = async ()=>{
        try{
        const response = await axios.get("http://localhost:3000/auth/verify", {
        headers: header
            })
        
        
         if (response.status === 200) {
          
          setData({
            username: decoded.userName,
            email: decoded.userEmail,
          });
           const timer = setTimeout(() => {
            navigate("/");
          }, 1000);

          return () => clearTimeout(timer);
        }

        }

        catch(error){
            setError(error.message)
        }
     
    }

    verify();
    
  }, [token, navigate, setData])
  return (
    <>
   <LoadingData></LoadingData>
    </>
   
  )
}

export default LoginSuccess