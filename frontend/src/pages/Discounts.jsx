import React from 'react'
import TextGlitchAnimation from '@/components/TextGlitchAnimation'
import {useState, useEffect} from "react"
import Error from "../components/handleData/Error"
import LoadingData from "../components/handleData/LoadingData"
import {Card, CardBody, CardFooter, Image, Tooltip} from "@heroui/react";
import { FaCartPlus } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from 'react-router';
import Nav from "../components/Nav"
import product from '@/api/product'
import handleApiError from '../api/handleApiError';
import cart from '../api/cart';
import favorites from '@/api/favorites'
import { useData } from '../Context/UserDataContext';
import { useCategory } from '../Context/CategoyContext';
function Discounts() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const {clearErrors, handleError, fieldErrors, globalError} = handleApiError()
    const { data } = useData();
    const {newProduct, setNewProduct, addToCart, setAddToCart} = useCategory();
    useEffect(()=>{
        setLoading(true)
        const fetchProducts = async()=>{
            try{
                const response = await product.displayDiscount();
                if(response.status === 200){
                    setProducts(response.data.products);
                 
                }
            }catch(error){
                console.log(error);
                setError(error)
            }
            finally{
                setLoading(false)
            }
        }
        fetchProducts();
    }, [])

    const handleAddToFavorites = async (productId) => {
    try{
        clearErrors();
        if (!data || !data.username) {
            alert("Musisz się zalogować, aby dodać produkt do ulubionych!");
            navigate('/');
            return; 
        }
        const result = await favorites.addToFavorites(productId);
        setNewProduct(prev => [...prev, productId]);
        alert("Produkt został dodany do ulubionych");
        }
        catch(error){
            handleError(error);
            alert("Wystąpił błąd podczas dodawania produktu do ulubionych.");
            console.log(globalError)
        }
    };

    const handleCart = async (productId) => {
        try{
        clearErrors();
        if (!data || !data.username) {
            alert("Musisz się zalogować, aby dodać produkt do koszyka!");
            navigate('/');
            return; 
        }
        await cart.addCartProduct(productId);
        setAddToCart({product})   
        alert("Produkt został dodany do koszyka");
        }
        catch(error){
            handleError(error);
            console.log(globalError)
        }
    };

    const setDisplay = async (id)=>{
        await product.displayProduct(id);
        navigate(`/product/${id}`)
    }

    if(globalError !=""){
        return <Error error={globalError}></Error>
    }

    if(loading){
        return <LoadingData></LoadingData>
    }
  return (
    <>
    <Nav></Nav>
        
       
        <div className="min-h-[90vh] w-[80%] ml-[10%] flex items-center justify-center flex-col">
             <TextGlitchAnimation text="Promocje"></TextGlitchAnimation>
             <div className="w-full flex flex-wrap items-center justify-center gap-5">
                {products.map((product, index) => (
              <Card key={index} isPressable shadow="sm" className="px-2 min-h-[20rem] z-[10] self-start w-full max-w-[15rem] " >
                <CardBody className="overflow-visible p-0">
                  <Image
                    className="w-full object-cover h-[140px]"
                    onClick={()=>setDisplay(product._id)}
                    radius="lg"
                    shadow="sm"
                    src={`http://localhost:3000${product.images}`}
                    width="100%"
                  />
                  <p className="text-default-500 text-md mt-[.5rem] ml-[.5rem] mb-[.5rem]" onClick={()=>setDisplay(product._id)}>{product.name}</p>
                </CardBody>
                 {product.discount > 0 ? (
                  <>
                   <p className="text-sm text-primary text-left ml-[.5rem] "><span className="line-through mr-[.5rem]">{product.price} zł</span> {product.discount} zł</p>
                   
                  </>
                 ):(
                   <p className="text-sm text-primary text-left ml-[.5rem] ">{product.price} zł</p>
                 )}
               
               
               
                <CardFooter className="text-small justify-start">
                
                <div>
                  <Tooltip content="Dodaj do koszyka" showArrow={true} >
                      <FaCartPlus className="size-[2rem] mr-[.5rem] ml-[-0.5rem] radius-100 bg-[rgba(0,0,0,.1)] px-[.5rem] py-[.5rem] rounded-[100%] text-default-600" onClick={()=>{handleCart(product._id)}}/>
                    </Tooltip>
                </div>
                  
                  <Tooltip content="Dodaj do ulubionych" showArrow={true}>
                      <FaHeart className="size-[2rem] mr-[.5rem]  radius-100 bg-[rgba(0,0,0,.1)] px-[.5rem] py-[.5rem] rounded-[100%] text-primary" onClick={()=>{handleAddToFavorites(product._id)}}/>
                  </Tooltip>
              </CardFooter>
            </Card>
            ))}
             </div>
        </div>
    </>
  )
}

export default Discounts