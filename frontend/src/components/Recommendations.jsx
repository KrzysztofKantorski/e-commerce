import React from 'react'
import LoadingData from './handleData/LoadingData';
import Error from './handleData/Error';
import {Pagination} from "@heroui/react";
import {Card, CardBody, CardFooter, Tooltip, Image } from "@heroui/react";
import axios from "axios"
import {useState, useEffect} from "react"
import { FaCartPlus } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import handleApiError from '@/api/handleApiError'
import product from '@/api/product';
import { useNavigate } from 'react-router';
import { useCategory } from '../Context/CategoyContext';
import favorites from '@/api/favorites';
import cart from '@/api/cart';
function Recommendations({category, id}) {
  const ProductToSkip = id;
  const productCategory = category;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState();
  const {clearErrors, handleError, fieldErrors, globalError} = handleApiError()
  const navigate = useNavigate();
  const {newProduct, setNewProduct, addToCart, setAddToCart} = useCategory();

  const setDisplay = (id)=>{
    try{
      clearErrors();
      product.displayProduct(id)
      navigate(`/product/${id}`)
      
    }
    catch(error){
      handleError(error);
      console.log(globalError);
    }
  }


  const fetchProducts = async (page = 1) => {
      try {
        let url = "http://localhost:3000/products";
        const params = { page, limit: 5 };
        if (productCategory && productCategory !== "all") {
          url += `/category/${productCategory}`;
        }
        const response = await axios.get(url, { params });
        const filteredProducts = response.data.products.filter(
          product => product._id !== ProductToSkip
        );
        setProducts(filteredProducts);
        setPages(response.data.totalPages);
        setError(null);
        console.log(response.data.products)
      
    } catch (err) {
        handleError(err);
        console.log(globalError);
        setError("Błąd ładowania produktów");
        setProducts([]);
    } finally {
        setLoading(false);
    }
    }
  
  //fetch products
  useEffect(() => {
    setCurrentPage(1);
    fetchProducts(1)
  }, [category]);
  
  
   const handlePageChange = (clickedPage)=>{
      setCurrentPage(clickedPage);
      fetchProducts(clickedPage)
  }

  const handleAddToFavorites = async (productId) => {
    try{
    clearErrors();
    const result = await favorites.addToFavorites(productId);
    setNewProduct(prev => [...prev, productId]);
    alert("Produkt został dodany do ulubionych"); 
    
    }catch(error){
        handleError(error, "favorites");
        alert("Produkt jest już w ulubionych");
        console.log(globalError)
    }
    
  };

const handleCart = async (productId) => {
  try{
    clearErrors();
    await cart.addCartProduct(productId);
    alert("Produkt został dodany do koszyka");
    setAddToCart({product})
  }
  catch(error){
    handleError(error);
    console.log(globalError);
  }
    
};
  if(error){
    <Error></Error>
  }
  if(loading){
    <LoadingData></LoadingData>
  }
  return (
    <div>
   <div className="relative flex flex-wrap items-center justify-center w-[100%] mr-[10%]  gap-[1rem] relative ">
     
    {products.map((product, index) => (
        
 <Card key={index} isPressable shadow="sm" className="px-2 min-h-[18rem] z-[10] self-start w-[13rem]" >
          <CardBody className="overflow-visible p-0">
            <Image
              className="w-full object-cover h-[140px]"
              onClick={()=>setDisplay(product._id)}
            
              radius="lg"
              shadow="sm"
              src={`http://localhost:3000${product.images}`}
              width="100%"
            />
             <p className="text-default-500 text-sm mt-[.5rem] ml-[.5rem] mb-[.5rem]" onClick={()=>setDisplay(product._id)}>{product.name}</p>
          </CardBody>
          {product.discount >0 ? (
             <p className="text-sm text-primary text-left ml-[.5rem] "><span className="mt-[.5rem] line-through">{product.price} zł</span> {product.discount} zł</p>
          ) : (
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
     <div className="flex w-full justify-center mt-[1rem]">
          <Pagination  initialPage={currentPage} showControls  total={pages} className="  relative text-center z-[10]" onChange={handlePageChange}/>
      </div>
</div>

  )
}

export default Recommendations