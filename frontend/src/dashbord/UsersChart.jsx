import React from 'react'
import {useState, useEffect} from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import SideBar from "./SideBar"
import { Bar, Line, Pie } from 'react-chartjs-2';
import axios from 'axios';
import Cookies from 'universal-cookie';
import LoadingData from '@/components/handleData/LoadingData';
import Error from '@/components/handleData/Error';
import {useNavigate} from "react-router"
import {Button} from "@heroui/react";
import Hamburger from './Hamburger';
// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const cookies = new Cookies();
function UsersChart() {
    const [stats, setStats] = useState(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
      const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
      });
      const navigate = useNavigate();
       const token = cookies.get("TOKEN");
        if (!token) {
          alert("Twoja sesja zakończyła się - zaloguj się ponownie");
          navigate("/Login");
          return;
        }

const fetchStats = async()=>{
    setLoading(true)
    setError(null)
    try{
       const token = cookies.get("TOKEN");
    if (!token) {
      alert("Twoja sesja zakończyła się - zaloguj się ponownie");
      navigate("/Login");
      return;
    }
    const params = {};
    if(dateRange.startDate){
      params.startDate = dateRange.startDate;
    }
    if(dateRange.endDate){
      params.endDate = dateRange.endDate;
    }

    const url = "http://localhost:3000/stats/users";

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params
    })

    if(response.status == 200){
      setStats(response.data.stats);
      console.log("success")
      console.log(response.data.stats)
    }
    
    } 
  catch(error){
   
     if (error.response && error.response.status === 404) {
        alert("Brak danych, wybierz inny zakres");
    } else if (error.response && error.response.status === 401) {
        alert("Twoja sesja zakończyła się - zaloguj się ponownie");
        navigate("/Login");
    } else {
        console.error('Error fetching stats:', error);
        setError("Wystąpił błąd podczas pobierania statystyk");
    }
    
  }
  finally{
    setLoading(false)
  }
  }
  
  useEffect(()=>{
    fetchStats();
  },[])

const handleDateChange = (e)=>{
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    })
    
  }
const handleSubmit = (e) => {
    e.preventDefault();
    fetchStats();
  };

const userRoleChartData = {
    labels: stats ? Object.keys(stats.roleDistribution) : [],
    datasets: [
      {
        label: 'Role użytkowników',
        data: stats ? Object.values(stats.roleDistribution) : [],
        backgroundColor: [
          'oklch(47.655% 0.23035 318.675)',
          'rgba(0,0,0,.1)',
          'rgba(238, 0, 198, 1)',
          'rgba(0, 10, 150, 1)',
        ],
      }
    ]
  }

const usersByOrdersChartData = {
    labels: stats ? Object.keys(stats.topUsersByOrders) : [], // Top 10 products
    datasets: [
      {
        label: 'Ilość zamówień użytkownika',
        data: stats ? Object.values(stats.topUsersByOrders).slice(0, 10) : [],
        backgroundColor: 'oklch(47.655% 0.23035 318.675)',
      },
    ],
  };



  const usersBySpending = {
    labels: stats ? Object.keys(stats.topUsersBySpending) : [], // Top 10 products
    datasets: [
      {
        label: 'Ilość zamówień użytkownika',
        data: stats ? Object.values(stats.topUsersBySpending).slice(0, 10) : [],
        backgroundColor: 'oklch(47.655% 0.23035 318.675)',
      },
    ],
  };
if (loading){
return <LoadingData></LoadingData>;
} 
if(error){
  return <Error></Error>
}


  return (
    <div className="w-full flex min-h-[100vh] mt-[5rem] xl:mt-[0]">
        <SideBar></SideBar>
        <Hamburger></Hamburger>
        <div className="w-[80%] ml-[10%] gap-5 flex flex-col mt-[2rem] lg:flex-row lg:ml-[15%] lg:w-[100%]">
          <div>
             {stats && (
              <div>
        <div className="bg-white p-4 rounded shadow h-[7rem] mb-[1rem] flex justify-center flex-col">
            <h3 className="font-semibold text-primary">Łączna ilość użytkowników</h3> 
            <p className="text-2xl">{stats.totalUsers}</p>

          </div>
                 <div className="bg-white p-4 rounded shadow mb-[1rem]">
            <h3 className="font-semibold text-primary">Okres czasu</h3>
            <p className="text-sm">
              {dateRange.startDate || 'Cały czas'} - {dateRange.endDate || 'Teraz'}
            </p>
          </div>
              </div>
         
          

             )}
    <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 rounded max-h-[15rem] lg:p-2">
         <div className="mb-[1rem] ">
         <label className="block mb-2">Początek</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="p-2 border rounded "
            />
      </div>

      <div>
         <label className="block mb-2">Koniec</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="p-2 border rounded"
            />
      </div>
    <Button type="submit" color="primary" className="mt-[1rem] mb-[1rem]">Zastosuj</Button>
      </form>
     

    </div>
    <div>
      
    </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
               
               <div className="bg-white p-4 rounded shadow">
                 <h3 className="font-semibold mb-4 text-primary">Zamówienia na podstawie statusu</h3>
                 <div className="h-64 flex justify-center">
                   <Pie data={userRoleChartData} options={{ responsive: true }} />
                 </div>
               </div>
     
               
               <div className="bg-white p-4 rounded shadow">
                 <h3 className="font-semibold mb-4 text-primary">Przychód na przedziale miesiąca</h3>
                 <div className="h-64 flex justify-center">
                   <Bar data={usersByOrdersChartData} options={{ responsive: true }} />
                 </div>
               </div>
     
               
               <div className="bg-white p-4 rounded shadow lg:col-span-2 lg:flex lg:items-center lg:flex-col">
                 <h3 className="font-semibold mb-4 text-primary">Najczęściej sprzedane produkty</h3>
                 <div className="flex justify-center h-64  xl:h-90 xl:w-[70rem] xl:items-center " >
                   <Bar data={usersBySpending} options={{ responsive: true }} />
                 </div>
               </div>
             </div>
            
           
     </div>
      
     
    </div>
     

     
    
  )
}

export default UsersChart