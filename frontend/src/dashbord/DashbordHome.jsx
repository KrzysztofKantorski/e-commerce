import SideBar from "./SideBar"
import OrdersChart from './OrdersChart'
import { useEffect, useState } from 'react'
import {useRole} from '@/hooks/userRole'
import Error from '@/components/handleData/Error'
import LoadingData from '@/components/handleData/LoadingData'

function DashbordHome() {
const [error, setError] = useState(null);
const { isReady } = useRole();
if(error){
  return <Error message={error}></Error>
}
if(!isReady){
  return <LoadingData></LoadingData>
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