import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from "./pages/Home"
import Product from "./pages/Product"
import Login from "./pages/Login"
import Register from "./pages/Register"
import LoginSuccess from "./pages/verifyLogin"
import FavoriteProducts from "./pages/FavoriteProducts"
import CartProducts from "./pages/CartProducts"
import AddReview from "./pages/AddReview"
import Order from "./pages/Order"
import Customize from "./pages/Customize"
import OrderSuccess from "./pages/OrderSuccess"
import ShowOrders from "./pages/ShowOrders"
import Discounts from './pages/Discounts'
import Newest from './pages/Newest'
import Category from './pages/Category'
import DashbordHome from './dashbord/DashbordHome'
import Products from './dashbord/Products'
import AddProduct from './dashbord/AddProduct'
import UpdateProduct from './dashbord/UpdateProduct'
import DeleteProduct from './dashbord/DeleteProduct'
import UsersChart from './dashbord/UsersChart'
import {HeroUIProvider} from '@heroui/react'
import { BrowserRouter, Routes, Route } from "react-router";
import { CategoryProvider } from './Context/CategoyContext'
import { UserDataProvider } from './Context/UserDataContext'

export default function App() {
  return (
    <>
    <BrowserRouter>
    <UserDataProvider>
    <CategoryProvider>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/product/:id" element={<Product />}></Route>
        <Route path="/Login" element={<Login />}></Route>
        <Route path="/verify" element={<LoginSuccess />}></Route>
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
