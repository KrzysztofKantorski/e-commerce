import React from 'react'
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react";
import {useState, useEffect} from "react";
import {Tooltip} from "@heroui/tooltip";
import LoadingData from './handleData/LoadingData';
import Error from './handleData/Error';
import { FaTrashAlt } from "react-icons/fa";
import { FaCartPlus, FaArrowRight } from "react-icons/fa6";
import { useCategory } from "../Context/CategoyContext";
import {useNavigate} from "react-router"
import cart from '../api/cart';
import product from '../api/product';
import handleApiError from '../api/handleApiError';
function Cart() {
const {addToCart} = useCategory();
const [cartProducts, setCartProducts] = useState([]);
const [loading, setLoading] = useState(true);
const navigate = useNavigate();
const [updateCart, setUpdateCart] = useState([]);
const {clearErrors, handleError, globalError} = handleApiError()

const handleRemoveFromCart = async (productId) => {
    try{
        clearErrors();
        const response =  await cart.removeCartProduct(productId);
        if(response.status == 200){
            setUpdateCart(prev => [...prev, productId]);
            alert("Produkt został usunięty z koszyka");
        }
    }
    catch(error){
        handleError(error);
        console.log(globalError);
    }
};


 const showCart = ()=>{
    navigate("/CartProducts")
 }

  const setDisplay = async(id)=>{
    clearErrors();
    await product.displayProduct(id);
    navigate(`/product/${id}`)
}
useEffect(()=>{
const displayCart = async ()=>{
    setLoading(true);
        try{
            clearErrors();
            const response = await cart.displayCart();
            if(response.status == 200){
                setCartProducts(response.data.cart);
                console.log(response.data.cart);   
            }
        }
        catch(error){
            handleError(error);
            console.log(globalError);
        }
        finally{
            setLoading(false);
        }
}
displayCart();
}, [addToCart, updateCart, navigate])
if(loading){
    <LoadingData></LoadingData>
}
if(globalError !=""){
    <Error>{globalError}</Error>
}
  return (
    <>
    <div className="relative "> 
    <div className="absolute top-[-0.5rem] right-[-0.1rem] text-white bg-primary px-[.5rem] py-[.1rem] rounded-[100%] z-[1000000]">{cartProducts.length}</div>
    <Dropdown>
        <DropdownTrigger>
            <FaCartPlus className="relative size-[2.5rem] mr-[.5rem] ml-[-0.5rem] radius-100 bg-[rgba(0,0,0,.1)] px-[.5rem] py-[.5rem] rounded-[100%] text-default-600"/>
        </DropdownTrigger>
   
       <DropdownMenu aria-label="Favorite products" className="relative min-w-[300px] lg:min-w-[400px]" >
           <DropdownItem key="see_more" className="text-right w-[10%] ml-[90%] text-center" >
               <Tooltip content="Zobacz wszystkie">
                {cart.length === 0 ? (""): (
                     <FaArrowRight className="text-center" onClick={()=>{showCart()}}/>
                )}
               </Tooltip>
           </DropdownItem>
       {cartProducts.length > 0 ? (
       cartProducts.map((cartProduct) => (
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