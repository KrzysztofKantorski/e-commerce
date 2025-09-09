import React from 'react'
import { FaHeart } from "react-icons/fa";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react";
import {useState, useEffect} from "react";
import axios from "axios"
import { cn } from "@/lib/utils";
import {Tooltip} from "@heroui/tooltip";
import LoadingData from '../components/handleData/LoadingData';
import Cookies from "universal-cookie"
import { FaTrashAlt } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from 'react-router';
import { useCategory } from "../Context/CategoyContext";
import {Card, CardBody, CardFooter, Image} from "@heroui/react";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { HyperText } from "@/components/magicui/hyper-text";
const cookies = new Cookies();

function FavoriteProducts() {
   
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
    <div className="absolute flex h-[100vh] t-[0] bottom-[0] left-[0] right-[0] w-[100%] items-center justify-center overflow-hidden rounded-lg border bg-background p-20 z-[1]">
         <AnimatedGridPattern
            numSquares={120}
            maxOpacity={1}
            duration={2}
            repeatDelay={1}
            className={cn(
              "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]",
              "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
            )}>
    
          </AnimatedGridPattern>
    </div>
    <div className="flex items-center justify-center min-h-[100vh] flex-col">
 <HyperText duration={1000} className="relative text-primary text-center text-[6rem] z-[1000]">Polubione produkty</HyperText>
    <div className="flex  gap-5 justify-center items-center flex-wrap">
        
    {favorites.length > 0 ? (
    favorites.map((favProduct, index) => (
        <>
         <Card key={index} isPressable shadow="sm"  className="px-2 z-[10] w-[15rem] h-[18rem]"> 
          <CardBody className="overflow-visible p-0" onClick={()=>setDisplay(favProduct._id)}>
            <Image
            
            
              alt={favProduct.name}
              className="w-full object-cover h-[140px]"
              radius="lg"
              shadow="sm"
               src={`http://localhost:3000${favProduct.images}`}
              width="100%"
            /> 
          <p className="text-default-500 text-xl ml-[.5rem] mb-[.5rem] mt-[.5rem]" onClick={()=>setDisplay(favProduct._id)} >{favProduct.name}</p>
      
          </CardBody>
                <p className="text-xl text-left text-primary ml-[.5rem]" onClick={()=>setDisplay(favProduct._id)} >{favProduct.price} zł</p>
          <CardFooter className="text-small justify-start" >
            <Tooltip content="Usuń produkt">
                <FaTrashAlt onClick={()=>{removeFromFavorites(favProduct._id)}}className="text-lg"></FaTrashAlt>
            </Tooltip>
           
          </CardFooter>
        </Card>           
        </>
                        
    ))
  ) : (
    <DropdownItem key="no_products" isReadOnly>Brak ulubionych produktów</DropdownItem>
  )}
    
    </div>
    </div>
</>     
  )
}

export default FavoriteProducts