import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {lazy, Suspense} from "react";
const Home = lazy(()=>import("./pages/Home"))
const Product = lazy(()=> import("./pages/Product"))
const Login = lazy(()=> import( "./pages/Login"))
const Register = lazy(()=> import("./pages/Register"))
const FavoriteProducts = lazy(()=> import("./pages/FavoriteProducts")) 
const CartProducts = lazy(()=> import("./pages/CartProducts")) 
import AddReview from "./pages/AddReview"
import Order from "./pages/Order"
const Customize = lazy(()=> import("./pages/Customize"))
const OrderSuccess = lazy(()=> import("./pages/OrderSuccess"))
import ShowOrders from "./pages/ShowOrders"
import Discounts from './pages/Discounts'
import Newest from './pages/Newest'
import Category from './pages/Category'
const DashbordHome = lazy(()=> import('./dashbord/DashbordHome'))
import Products from './dashbord/Products'
const AddProduct = lazy(()=> import('./dashbord/AddProduct')) 
const UpdateProduct = lazy(()=> import('./dashbord/UpdateProduct')) 
const DeleteProduct = lazy(()=> import('./dashbord/DeleteProduct')) 
const  UsersChart = lazy(()=> import('./dashbord/UsersChart'))
import {HeroUIProvider} from '@heroui/react'
import LoadingData from './components/handleData/LoadingData'
import { BrowserRouter, Routes, Route } from "react-router";
import { CategoryProvider } from './Context/CategoyContext'
import { UserDataProvider } from './Context/UserDataContext'
import { InterceptorSetup } from './interceptorSetup';
export default function App() {

  return (
    <>
    <BrowserRouter>
    
    <UserDataProvider>
      <InterceptorSetup />
    <CategoryProvider>
    <Suspense fallback={<LoadingData />}>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/product/:id" element={<Product />}></Route>
        <Route path="/Login" element={<Login />}></Route>
        <Route path="/Register" element={<Register />}></Route>
        <Route path="/FavoriteProducts" element={<FavoriteProducts />}></Route>
        <Route path="/CartProducts" element={<CartProducts />}></Route>
        <Route path="/AddReview/:product" element={<AddReview />}></Route>
        <Route path="/Order" element={<Order />}></Route>
        <Route path="/Customize" element={<Customize />}></Route>
        <Route path="/OrderSuccess" element={<OrderSuccess />}></Route>
        <Route path="/ShowOrders" element={<ShowOrders />}></Route>
        <Route path="/Discounts" element={<Discounts />}></Route>
        <Route path="/Newest" element={<Newest />}></Route>
        <Route path="/Category" element={<Category />}></Route>
        <Route path="/DashbordHome" element={<DashbordHome />}></Route>
        <Route path="/Products" element={<Products />}></Route>
        <Route path="/AddProduct" element={<AddProduct />}></Route>
        <Route path="/UpdateProduct" element={<UpdateProduct />}></Route>
        <Route path="/DeleteProduct" element={<DeleteProduct />}></Route>
        <Route path="/UsersChart" element={<UsersChart />}></Route>
      </Routes>
      </Suspense>
      </CategoryProvider>
      </UserDataProvider>
    </BrowserRouter>
    
    </>
  );
}




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeroUIProvider>
  <App></App>
    </HeroUIProvider>
  </StrictMode>,
)
