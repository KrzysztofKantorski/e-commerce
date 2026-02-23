import React from 'react'
import { FaHeart } from "react-icons/fa";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react";
import {useState, useEffect} from "react";
import {Tooltip} from "@heroui/tooltip";
import LoadingData from '../components/handleData/LoadingData';
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router';
import { useCategory } from "../Context/CategoyContext";
import {Card, CardBody, CardFooter, Image} from "@heroui/react";
import TextGlitchAnimation from '@/components/TextGlitchAnimation';
import favorites from '../api/favorites';
import product from '../api/product';
import Nav from '../components/Nav';
function FavoriteProducts() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const {newProduct, setNewProduct} = useCategory();
    const [deleted, setDeleted] = useState([]);
    const navigate = useNavigate();

    const removeFromFavorites = async (id)=>{
           try{
            
            const response = await favorites.removeFavoriteProduct(id);

            if(response.status == 200){
                setDeleted(id);
                alert("produkt został usunięty z ulubionych")
                console.log(response.data.favorites); 
            }
            }catch(error){
                setError(error.message)
            }
        }



    const setDisplay = async (id)=>{
        const response = await product.displayProduct(id)
        if(response.status == 200){
            navigate(`/product/${id}`)
        }
    }


    useEffect(()=>{
       
        const displayFavorites = async ()=>{
            setLoading(true);
            try{
            const response = await favorites.displayFavoriteProducts();

            if(response.status == 200){
                setFavoriteProducts(response.data.favorites);
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
          <LoadingData></LoadingData>
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
    <Nav></Nav>
    <div className="flex items-center justify-center min-h-[100vh] flex-col">
<TextGlitchAnimation text="Polubione produkty"></TextGlitchAnimation>
    <div className="flex gap-5 justify-center items-center flex-wrap w-[70%]">
      
    {favoriteProducts.length > 0 ? (
    favoriteProducts.map((favProduct, index) => (
        <>
         <Card key={index} isPressable shadow="sm"  className="px-2 z-[10] w-[15rem] min-h-[20rem]"> 
          <CardBody className="overflow-visible p-0" onClick={()=>setDisplay(favProduct._id)}>
            <Image
              alt={favProduct.name}
              className="w-full object-cover h-[140px]"
              radius="lg"
              shadow="sm"
               src={`http://localhost:3000${favProduct.images}`}
              width="100%"
            /> 
          <p className="text-default-500 text-md ml-[.5rem] mb-[.5rem] mt-[.5rem]" onClick={()=>setDisplay(favProduct._id)} >{favProduct.name}</p>
      
          </CardBody>
                <p className="text-sm text-left text-primary ml-[.5rem]" onClick={()=>setDisplay(favProduct._id)} >{favProduct.price} zł</p>
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