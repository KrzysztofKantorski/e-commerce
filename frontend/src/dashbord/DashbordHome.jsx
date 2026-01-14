import React, { use, useEffect } from 'react'
import SideBar from "./SideBar"
import OrdersChart from './OrdersChart'
import Cookies from "universal-cookie"
import {useNavigate} from "react-router"
import { useState } from 'react'
import Error from '@/components/handleData/Error'
const cookies = new Cookies();

function DashbordHome() {
const navigate = useNavigate();
const token = cookies.get("TOKEN");
const [error, setError] = useState(null);
useEffect(() => {
  if(!token){
  setError("Brak tokena autoryzacyjnego. Zaloguj się ponownie.");
  navigate("/Login");
  }
 }, [navigate, token]);

if(error){
  return <Error message={error}></Error>
}
  return (
    <>
    <div className="flex w-full min-h-[100vh] gap-5">
        <SideBar></SideBar>
     
        <OrdersChart></OrdersChart>
    </div>
    
    
    </>
    
  )
}

export default DashbordHome