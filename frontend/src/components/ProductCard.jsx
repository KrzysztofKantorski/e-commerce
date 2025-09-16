import React from 'react'
import {useState, useEffect, useRef} from "react"
import {Card, CardBody, CardFooter, Image, Tooltip, Button} from "@heroui/react";
import { FaCartPlus } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import {FaRegFaceSadCry} from "react-icons/fa6";
import Error from "./handleData/Error"
import LoadingData from "./handleData/LoadingData"
import axios from "axios"
import { useNavigate } from 'react-router';
import SideBar from "./SideBar"
import { useCategory } from '../Context/CategoyContext';
import Cookies from "universal-cookie"
import {Pagination} from "@heroui/react";

const cookies = new Cookies();
function ProductCard() {
 const [currentPage, setCurrentPage] = useState(1);
const firstRender = useRef(true)
const [pages, setPages] = useState();
const [products, setProducts] = useState([]);
const navigate = useNavigate();
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null)

const { category } = useCategory(); 
const {filter} = useCategory();
const {newProduct, setNewProduct} = useCategory();
const {addToCart, setAddToCart} = useCategory();
const [cart, setCart] = useState([]);



    const handleCart = async(product)=>{
      const quantity = 1;
      try{
        
        const token = cookies.get("TOKEN");
        if (!token) {
        alert("Musisz być zalogowany, aby dodawać do ulubionych");
        
        return;
      }
        console.log(token)
        const url = `http://localhost:3000/cart`;
        const response = await axios.post(url,{
         productId: product, quantity :quantity
        }
        ,  {
        headers: {
        Authorization: `Bearer ${token}`,
          }
        });
        if(response.status == 201){
          setCart(prev => [...prev, product]);
         alert("Produkt został dodany do koszyka");
         setAddToCart({product})
         
        }
      }
      catch(error){
        console.log("err", error.message)
         // Obsługa różnych błędów
      if (error.response?.status === 400) {
        alert("Produkt został już dodany do ulubionych");
        navigate("/");
      } else if (error.response?.status === 403) {
        alert("Brak uprawnień do wykonania tej operacji");
        
      } else {
        alert("Wystąpił błąd podczas dodawania do ulubionych");
      } 
      }
      
    }
   
   






 const  addToFavorites = (id)=>{

    const addToFavorites = async()=>{
      try{
        const token = cookies.get("TOKEN");
        if (!token) {
        alert("Musisz być zalogowany, aby dodawać do ulubionych");
        
        return;
      }
        console.log(token)
        const url = `http://localhost:3000/favorites/${id}`;
        const response = await axios.post(url,
          {id},  {
        headers: {
        Authorization: `Bearer ${token}`,
          }
        });
        if(response.status == 201){
          setNewProduct(prev => [...prev, id]);
         alert("Produkt został dodany do ulubionych")
         
        }
      }
      catch(error){
        console.log(error.message)
        
      if (error.response?.status === 400) {
        alert("Produkt został już dodany do ulubionych");
        navigate("/");
      } else if (error.response?.status === 403) {
        alert("Brak uprawnień do wykonania tej operacji");
        
      } else {
        alert("Wystąpił błąd podczas dodawania do ulubionych");
      } 
      }
      
    }
    addToFavorites();
}

const setDisplay = (id)=>{
  axios.get(`http://localhost:3000/products/${id}`)
    navigate(`/product/${id}`)
}

const fetchProducts = async (page = 1) => {
    try {
    let url = "http://localhost:3000/products";
    const params = { page, limit: 10 };
    
    if (category && category !== "all") {
      url += `/category/${category}`;
    }

    if (filter && filter !== "newest") {
      params.sort = filter;
    }

    const response = await axios.get(url, { params });
    
    setProducts(response.data.products || []);
    setPages(response.data.totalPages);
    setError(null);
    
  } catch (err) {
    console.error('Error:', err);
    setError("Błąd ładowania produktów");
    setProducts([]);
  } finally {
    setLoading(false);
    firstRender.current = false;
  }
  }

//fetch products
useEffect(() => {
  
  let isMounted = true;
  
  
  setCurrentPage(1);
  
  if (firstRender.current) {
    setLoading(true);
    setTimeout(() => {
      if (isMounted) fetchProducts(1);
    }, 2500);
  } else {
    if (isMounted) fetchProducts(1);
  }

  return () => {
    isMounted = false;
  }
}, [category, filter]);


 const handlePageChange = (clickedPage)=>{
    setCurrentPage(clickedPage);
    fetchProducts(clickedPage)
}
  return (
    <>
   
    <div className=" w-[90%] flex  items-start flex-col justify-start gap-[1.5rem] ml-[5%] z-[10] sm:w-[80%] sm:ml-[10%] lg:flex-row lg:ml-[5%]">
  
    {loading ? (
      <div className="h-[50vh] w-full flex items-center justify-center ml-[10%]">
         <LoadingData title={loading}></LoadingData>
        </div>
     
    ) : error ? (
      <div className="text-center flex flex-col px-8 py-8 border-b">
        <h2 className="text-lg text-default-500 mb-4">Nie znaleziono żadnego produktu</h2>
        <FaRegFaceSadCry className="text-5xl text-primary mx-auto" />
      </div>
    ) : (
      <>
      
   <SideBar></SideBar>
   <div className="relative  flex items-start  justify-center lg:justify-start">


<div className=" w-full flex items-start mt-[3rem] justify-center lg:h-[130vh] xl:h-[120vh] 2xl:h-[100vh]">


 <div className="w-[100%] gap-4 grid grid-cols-2 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 justify-items-center">
     
      {products.map((product, index) => (
        
        <Card key={index} isPressable shadow="sm" className="px-2 min-h-[20rem] z-[10] self-start w-full max-w-[20rem] " >
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
          <p className="text-sm text-primary text-left ml-[.5rem] ">{product.price} zł</p>
          <CardFooter className="text-small justify-start">
           
           <div>
             <Tooltip content="Dodaj do koszyka" showArrow={true} >
                <FaCartPlus className="size-[2rem] mr-[.5rem] ml-[-0.5rem] radius-100 bg-[rgba(0,0,0,.1)] px-[.5rem] py-[.5rem] rounded-[100%] text-default-600" onClick={()=>{handleCart(product._id)}}/>
              </Tooltip>
           </div>
            
            <Tooltip content="Dodaj do ulubionych" showArrow={true}>
                <FaHeart className="size-[2rem] mr-[.5rem]  radius-100 bg-[rgba(0,0,0,.1)] px-[.5rem] py-[.5rem] rounded-[100%] text-primary" onClick={()=>{addToFavorites(product._id)}}/>
            </Tooltip>
        </CardFooter>
           
      </Card>
      ))}
       <Pagination  initialPage={currentPage} showControls  total={pages} className="
     
    
    absolute 
  
    z-[10] 
    w-[300px] 
    left-[2rem] 
    bottom-[-5rem] 
    sm:bottom-[-5rem]
    sm:left-[10rem]
    md:left-[10rem]
    lg:left-[-18rem] 
    lg:bottom-[30rem]
    xl:left-[-18rem] 
    xl:bottom-[25rem]
  2xl:left-[20rem] 
   2xl:bottom-[15rem]
  " onChange={handlePageChange}/>
    </div>
   
</div>




   </div>
        
    </>
    )}
   
    </div>
     </>
  )

}

export default ProductCard





 