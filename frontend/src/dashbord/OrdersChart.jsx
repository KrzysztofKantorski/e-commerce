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

import { Bar, Line, Pie } from 'react-chartjs-2';
import axios from 'axios';
import Cookies from 'universal-cookie';
import LoadingData from '@/components/handleData/LoadingData';
import Error from '@/components/handleData/Error';
import {useNavigate} from "react-router"
import {Button} from "@heroui/react";
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
import Hamburger from './Hamburger';
const cookies = new Cookies();
function OrdersChart() {
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

    const url = "http://localhost:3000/stats";

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params
    })

    if(response.status == 200){
      setStats(response.data.stats);
    }

    } 
  catch(error){
     setError(error.response?.data?.message || 'Failed to fetch order statistics');
    console.error('Error fetching stats:', error);
  }
  finally{
    setLoading(false)
  }
  }
  
  useEffect(()=>{
    fetchStats();
  },[])

  const statusChartData = {
    labels: stats ? Object.keys(stats.statusDistribution) : [],
    datasets: [
      {
        label: 'Orders by Status',
        data: stats ? Object.values(stats.statusDistribution) : [],
        backgroundColor: [
          'oklch(47.655% 0.23035 318.675)',
          'rgba(0,0,0,.1)',
          'rgba(238, 0, 198, 1)',
          'rgba(0, 10, 150, 1)',
        ],
      }
    ]
  }

  const revenueChartData = {
    labels: stats ? Object.keys(stats.revenueByMonth) : [],
    datasets: [
      {
        label: 'Revenue by Month',
        data: stats ? Object.values(stats.revenueByMonth) : [],
        borderColor: 'oklch(47.655% 0.23035 318.675)',
        backgroundColor: 'oklch(50.655% 0.23035 318.675)',
      },
    ],
  };


  const productsChartData = {
    labels: stats ? Object.keys(stats.productSales).slice(0, 10) : [], // Top 10 products
    datasets: [
      {
        label: 'Units Sold',
        data: stats ? Object.values(stats.productSales).slice(0, 10) : [],
        backgroundColor: 'oklch(47.655% 0.23035 318.675)',
      },
    ],
  };

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
if (loading){
return <LoadingData></LoadingData>;
} 
if(error){
  return <Error></Error>
}

  return (
    

   
    <div className="w-[100%] ml-[0] gap-5 flex flex-col mt-[5rem] lg:flex-row lg:mt-[0] lg:w-[80%] lg:ml-[10%]">
       <Hamburger></Hamburger>
      <div className="ml-[1rem] w-[20rem] lg:ml-[5rem]">

       {stats && (
        <div className="mb-6 flex flex-col gap-3">
          <div className="bg-white p-4 rounded shadow ">
            <h3 className="font-semibold text-primary">łącznie zamówień</h3>
            <p className="text-2xl">{stats.totalOrders}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-primary">Łączny przychód</h3>
            <p className="text-2xl">${stats.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-primary">Okres czasu</h3>
            <p className="text-sm">
              {dateRange.startDate || 'Cały czas'} - {dateRange.endDate || 'Teraz'}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-6 p-2 bg-gray-100 rounded max-h-[15rem]">
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

      {stats && (
      
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
          
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-4 text-primary">Zamówienia na podstawie statusu</h3>
            <div className="h-64 flex justify-center">
              <Pie data={statusChartData} options={{ responsive: true }} />
            </div>
          </div>

          
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-4 text-primary">Przychód na przedziale miesiąca</h3>
            <div className="h-64 flex justify-center">
              <Line data={revenueChartData} options={{ responsive: true }} />
            </div>
          </div>

          
          <div className="bg-white p-4 rounded shadow lg:col-span-2 lg:flex lg:items-center lg:flex-col">
            <h3 className="font-semibold mb-4 text-primary">Najczęściej sprzedane produkty</h3>
            <div className="flex justify-center h-64  xl:h-90 xl:w-[70rem] xl:items-center " >
              <Bar data={productsChartData} options={{ responsive: true }} />
            </div>
          </div>
        </div>
       
        
      )}

    </div>
     
  )
}

export default OrdersChart