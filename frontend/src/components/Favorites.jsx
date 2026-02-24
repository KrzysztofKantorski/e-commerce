import React from 'react'
import { FaHeart } from "react-icons/fa";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react";
import {useState, useEffect} from "react";
import LoadingData from './handleData/LoadingData';
import {Tooltip} from "@heroui/tooltip";
import { FaTrashAlt } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from 'react-router';
import favorites from '../api/favorites';
import { useCategory } from '../Context/CategoyContext';
import handleApiError from '../api/handleApiError';
import product from '../api/product';
import { useData } from '../Context/UserDataContext';
function Favorites() {
    const [loading, setLoading] = useState(true);
    const [favorite, setFavorite] = useState([]);
    const navigate = useNavigate();
    const {newProduct, setNewProduct} = useCategory();
    const [removedProduct, setRemovedProduct] = useState("");
    const {clearErrors, handleError, fieldErrors, globalError} = handleApiError()
    const { data } = useData();
    const showFavorites = ()=>{
        try{
            clearErrors();
            if (!data || !data.username) {
                alert("Musisz się zalogować, aby dodać produkt do koszyka!");
                navigate('/');
                return; 
            }
             navigate("/FavoriteProducts")

        }
        catch(error){
            handleError(error);
            console.log(globalError);
        }
        
    }

    const setDisplay = (id)=>{
        product.displayProduct(id);
        navigate(`/product/${id}`)
    }

    const handleRemoveFromFavorites = async (productId) => {
        try{
            clearErrors();
            if (!data || !data.username) {
                alert("Musisz się zalogować, aby dodać produkt do koszyka!");
                navigate('/');
                return; 
            }
            const result = await favorites.removeFavoriteProduct(productId);
            setRemovedProduct(productId);
            if(result.success){
                console.log("Usunięto produkt z ulubionych");
            }
        }catch(error){
           handleError(error, "favorites");
        }
        
    };

    useEffect(()=>{
        clearErrors();
        const displayFavorites = async ()=>{
        setLoading(true);
        try{
            if (!data || !data.username) {
                alert("Musisz się zalogować, aby dodać produkt do koszyka!");
                navigate('/');
                return; 
            }
            const response = await favorites.displayFavoriteProducts();
            if(response.status == 200){
                setFavorite(response.data.favorites);
            }
            }
            catch(error){
                handleError(error, "favorites");
            }
            finally{
                setLoading(false);
            }
    }
    displayFavorites();
}, [newProduct, removedProduct])


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

if (globalError!="") {
        return (
            <Dropdown>
                <DropdownTrigger>
                    <FaHeart className="size-[2.5rem] mr-[.5rem] ml-[-0.5rem] radius-100 bg-[rgba(0,0,0,.1)] px-[.5rem] py-[.5rem] rounded-[100%] text-default-600"/>
                </DropdownTrigger>
                <DropdownMenu aria-label="Error">
                    <DropdownItem key="error" className="text-danger">
                        {globalError}
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        );
    }
  return (
  
    <>
    <div className="relative ">

    <div className="absolute top-[-0.5rem] right-[-0.1rem] text-white bg-primary px-[.5rem] py-[.1rem] rounded-[100%] z-[1000000]">{favorite.length}</div>

   <Dropdown>
        <DropdownTrigger>
            <FaHeart className="relative size-[2.5rem] mr-[.5rem] ml-[-0.5rem] radius-100 bg-[rgba(0,0,0,.1)] px-[.5rem] py-[.5rem] rounded-[100%] text-default-600"/>
        </DropdownTrigger>

    <DropdownMenu aria-label="Favorite products" className="relative min-w-[300px] lg:min-w-[400px]" >
        <DropdownItem key="see_more" className="text-right w-[10%] ml-[90%] text-center">
            <Tooltip content="Zobacz wszystkie">
                <FaArrowRight className="text-center" onClick={()=>{showFavorites()}}/>
            </Tooltip>
        </DropdownItem>
    
    {favorite.length > 0 ? (
    favorite.map((favProduct) => (
        <>
       <DropdownItem 
        key={favProduct._id} 
        textValue={favProduct.name}
        className="mt-[.5rem] "
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
                    <span className="text-right ml-[1rem] mt-[.2rem] w-[10%]" onClick={()=>handleRemoveFromFavorites(favProduct._id)}>
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