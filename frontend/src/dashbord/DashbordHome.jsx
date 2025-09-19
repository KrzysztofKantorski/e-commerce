import React from 'react'
import SideBar from "./SideBar"
function DashbordHome() {
  return (
    <>
    <div className="flex w-full min-h-[100vh] gap-5">
        <SideBar></SideBar>
        <div>
            <h1 className="text-lg">Panel Administratora</h1>
            
        </div>
    </div>
    
    
    </>
    
  )
}

export default DashbordHome