import React from 'react'
import { FaHeart } from "react-icons/fa";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react";
import {useState, useEffect} from "react";
import axios from "axios"
import {Tooltip} from "@heroui/tooltip";
import {useData} from "../Context/UserDataContext"
import LoadingData from './handleData/LoadingData';
import Error from './handleData/Error';
import Cookies from "universal-cookie"
import { FaTrashAlt } from "react-icons/fa";
import { FaCartPlus, FaArrowRight } from "react-icons/fa6";
import { useCategory } from "../Context/CategoyContext";
import {useNavigate} from "react-router"
import { useCart } from '@/hooks/useCart';
const cookies = new Cookies();
function Cart() {
const { data, logout } = useData(); 
const {addToCart} = useCategory();
const [cart, setCart] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);
const navigate = useNavigate();
const {removeFromCart, updateCart} = useCart();
const handleRemoveFromCart = async (productId) => {
    await removeFromCart(productId);
};

 const showCart = ()=>{
    navigate("/CartProducts")
 }

  const setDisplay = (id)=>{
    axios.get(`http://localhost:3000/products/${id}`)
    navigate(`/product/${id}`)
}
const token = cookies.get("TOKEN");    
useEffect(()=>{
const displayCart = async ()=>{
    setLoading(true);
        try{
            if(!token || token === "undefined" || token === "null"){
                setError("Brak tokena autoryzacyjnego. Zaloguj się ponownie.");
                console.log("No token found");
                navigate("/Login");
                return;
            }
            const url = "http://localhost:3000/cart";
            const response = await axios.get(url, {
            headers: {
            Authorization: `Bearer ${token}`,
            }});
            if(response.status == 200){
                setCart(response.data.cart);
                console.log(response.data.cart);   
            }
        }
        catch(error){
            setError(error.message)
        }
        finally{
            setLoading(false);
        }
}
displayCart();
}, [addToCart, updateCart, navigate, token])
if(loading){
    <LoadingData></LoadingData>
}
if(error){
    <Error></Error>
}
  return (
    <>
    <div className="relative "> 
    <div className="absolute top-[-0.5rem] right-[-0.1rem] text-white bg-primary px-[.5rem] py-[.1rem] rounded-[100%] z-[1000000]">{cart.length}</div>
    <Dropdown>
        <DropdownTrigger>
            <FaCartPlus className="relative size-[2.5rem] mr-[.5rem] ml-[-0.5rem] radius-100 bg-[rgba(0,0,0,.1)] px-[.5rem] py-[.5rem] rounded-[100%] text-default-600"/>
        </DropdownTrigger>
   
       <DropdownMenu aria-label="Favorite products" className="relative min-w-[300px] lg:min-w-[400px]" >
           <DropdownItem key="see_more" className="text-right w-[10%] ml-[90%] text-center" >
               <Tooltip content="Zobacz wszystkie">
                {cart.length === 0 ? (""): (
                     <FaArrowRight calssName="text-center" onClick={()=>{showCart()}}/>
                )}
               </Tooltip>
           </DropdownItem>
       {cart.length > 0 ? (
       cart.map((cartProduct) => (
           <>
          <DropdownItem 
           key={cartProduct.product._id} 
           textValue={cartProduct.product.name}
           className="mt-[.5rem]"
           >
           <div className="flex justify-space-between ">
               <div className=" flex gap-1 w-[60%]" onClick={()=>setDisplay(cartProduct.product._id)}>
                   <img 
                   src={`http://localhost:3000${cartProduct.product.images}`}
                   alt={cartProduct.product.name}
                   className="w-8 h-8 object-cover rounded"
                   />
                   <span className="truncate ">
                       {cartProduct.product.name}
                   </span>               
               </div>
               {cartProduct.product.discount>0 ?(
                 <span className="text-primary font-semibold ml-2 flex text-center w-[20%]">
                       {cartProduct.product.discount} zł
                   </span>
               ):(
                <span className="text-primary font-semibold ml-2 flex text-center w-[20%]">
                       {cartProduct.product.price} zł
                   </span>
               )}
                   
                     <span className="truncate">
                       {cartProduct.quantity}
                   </span>    
                   <Tooltip content="Usuń produkt">
                       <span className="text-right ml-[1rem] mt-[.2rem] w-[10%]" onClick={()=>handleRemoveFromCart(cartProduct.product._id)}>
                       <FaTrashAlt />
                       </span>
                   </Tooltip>                    
           </div>
           </DropdownItem>           
           </>
                           
       ))
     ) : (
       <DropdownItem key="no_products" isReadOnly>Brak produktów w koszyku</DropdownItem>
     )}
       </DropdownMenu>
       </Dropdown>
       </div>
   </>      
  )
}

export default Cart