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
function OrdersChart() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

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
      console.log("git");
      setStats(response.data.stats);
      console.log(response.data.stats);
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
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
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
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };


  const productsChartData = {
    labels: stats ? Object.keys(stats.productSales).slice(0, 10) : [], // Top 10 products
    datasets: [
      {
        label: 'Units Sold',
        data: stats ? Object.values(stats.productSales).slice(0, 10) : [],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
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
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex gap-5">
      <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-100 rounded">
         <div>
         <label className="block mb-2">Początek</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="p-2 border rounded"
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
      <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Zastosuj
        </button>
      </form>


      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">łącznie zamówień</h3>
            <p className="text-2xl">{stats.totalOrders}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Łączny przychód</h3>
            <p className="text-2xl">${stats.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Okres czasu</h3>
            <p className="text-sm">
              {dateRange.startDate || 'All time'} - {dateRange.endDate || 'Present'}
            </p>
          </div>
        </div>
      )}


      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-4">Zamówienia na podstawie statusu</h3>
            <div className="h-64">
              <Pie data={statusChartData} options={{ responsive: true }} />
            </div>
          </div>

          
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-4">Przychód na przedziale miesiąca</h3>
            <div className="h-64">
              <Line data={revenueChartData} options={{ responsive: true }} />
            </div>
          </div>

          
          <div className="bg-white p-4 rounded shadow lg:col-span-2">
            <h3 className="font-semibold mb-4">Top Selling Products</h3>
            <div className="h-64">
              <Bar data={productsChartData} options={{ responsive: true }} />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default OrdersChart