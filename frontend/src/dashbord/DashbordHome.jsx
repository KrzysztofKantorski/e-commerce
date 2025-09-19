import React from 'react'
import SideBar from "./SideBar"
import OrdersChart from './OrdersChart'
function DashbordHome() {
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