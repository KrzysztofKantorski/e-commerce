import React from 'react'
import { FaHeart } from "react-icons/fa";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react";
import {useState, useEffect} from "react";
import axios from "axios"
import {Tooltip} from "@heroui/tooltip";
import LoadingData from './handleData/LoadingData';
import Cookies from "universal-cookie"
import { FaTrashAlt } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from 'react-router';
import { useCategory } from "../Context/CategoyContext";
const cookies = new Cookies();

function Favorites() {
   
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const {newProduct, setNewProduct} = useCategory();
    const [deleted, setDeleted] = useState([]);
    const navigate = useNavigate();

     const removeFromFavorites = async (id)=>{
           try{
            const token = cookies.get("TOKEN");
            const url = `http://localhost:3000/favorites/remove/${id}`;
            const response = await axios.delete(url, {
            headers: {
            Authorization: `Bearer ${token}`,
            }
        });

            if(response.status == 200){
                setDeleted(id);
                console.log(response.data.favorites);
                
            }
        

            }catch(error){
                setError(error.message)
            }
          
        }

 const showFavorites = ()=>{
    navigate("/FavoriteProducts")
 }

    const setDisplay = (id)=>{
    axios.get(`http://localhost:3000/products/${id}`)
    navigate(`/product/${id}`)
    }


    useEffect(()=>{
       
        const displayFavorites = async ()=>{
             setLoading(true);
              
            try{
            const token = cookies.get("TOKEN");
            const url = "http://localhost:3000/favorites";
            const response = await axios.get(url, {
            headers: {
            Authorization: `Bearer ${token}`,
            }
        });

            if(response.status == 200){
                setFavorites(response.data.favorites);
                console.log(response.data.favorites);
                
            }
            }catch(error){
                setError(error.message)
            }
            finally{
                setLoading(false);
            }
        }
    displayFavorites();
}, [newProduct, deleted])


if (loading) {
        return (
            <Dropdown>
                <DropdownTrigger>
                    <FaHeart className="size-[2.5rem] mr-[.5rem] ml-[-0.5rem] radius-100 bg-[rgba(0,0,0,.1)] px-[.5rem] py-[.5rem] rounded-[100%] text-default-600"/>
                </DropdownTrigger>
                <DropdownMenu aria-label="Loading favorites">
                    <DropdownItem key="loading">
                        <LoadingData /> 
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        );
    }

if (error) {
        return (
            <Dropdown>
                <DropdownTrigger>
                    <FaHeart className="size-[2.5rem] mr-[.5rem] ml-[-0.5rem] radius-100 bg-[rgba(0,0,0,.1)] px-[.5rem] py-[.5rem] rounded-[100%] text-default-600"/>
                </DropdownTrigger>
                <DropdownMenu aria-label="Error">
                    <DropdownItem key="error" className="text-danger">
                        Błąd: {error}
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        );
    }
  return (
  
    <>
    <div className="relative ">

    <div className="absolute top-[-0.5rem] right-[-0.1rem] text-white bg-primary px-[.5rem] py-[.1rem] rounded-[100%] z-[1000000]">{favorites.length}</div>

   <Dropdown>
        <DropdownTrigger>
            <FaHeart className="relative size-[2.5rem] mr-[.5rem] ml-[-0.5rem] radius-100 bg-[rgba(0,0,0,.1)] px-[.5rem] py-[.5rem] rounded-[100%] text-default-600"/>
        </DropdownTrigger>

    <DropdownMenu aria-label="Favorite products" className="relative min-w-[400px]" >
        <DropdownItem key="see_more" className="text-right w-[10%] ml-[90%] text-center">
            <Tooltip content="Zobacz wszystkie">
                <FaArrowRight calssName="text-center" onClick={()=>{showFavorites()}}/>
            </Tooltip>
        </DropdownItem>
      

    {favorites.length > 0 ? (
    favorites.map((favProduct) => (
        <>
       <DropdownItem 
        key={favProduct._id} 
        textValue={favProduct.name}
        className="mt-[.5rem]"
        >
        <div className="flex justify-space-between ">

            <div className=" flex gap-1 w-[60%]" onClick={()=>setDisplay(favProduct._id)}>
                <img 
                src={`http://localhost:3000${favProduct.images}`}
                alt={favProduct.name}
                className="w-8 h-8 object-cover rounded"
                />
                <span className="truncate ">
                    {favProduct.name}
                </span>                    
            </div>
                <span className="text-primary font-semibold ml-2 flex text-center w-[20%]">
                    {favProduct.price} zł
                </span>
                <Tooltip content="Usuń produkt">
                    <span className="text-right ml-[1rem] mt-[.2rem] w-[10%]" onClick={()=>removeFromFavorites(favProduct._id)}>
                    <FaTrashAlt />
                    </span>
                </Tooltip>                    
        </div>
        </DropdownItem>           
        </>
                        
    ))
  ) : (
    <DropdownItem key="no_products" isReadOnly>Brak ulubionych produktów</DropdownItem>
  )}
    </DropdownMenu>
    </Dropdown>
    </div>
</>     
  )
}

export default Favorites