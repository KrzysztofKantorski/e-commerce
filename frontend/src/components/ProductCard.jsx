import React from 'react'
import {useState, useEffect} from "react"
import {Card, CardBody, CardFooter, Image, Tooltip, Button} from "@heroui/react";
import { FaCartPlus } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import axios from "axios"
import { useNavigate } from 'react-router';
import SideBar from "./SideBar"
import { Spinner } from "@heroui/react";
import { useCategory } from '../Context/CategoyContext';
function ProductCard() {
const [products, setProducts] = useState([]);
const navigate = useNavigate(); // Hook do nawigacji
const [loading, setLoading] = useState(true);

const [error, setError] = useState(null)
//display specific product
const { category } = useCategory(); // Pobieramy aktualną kategorię
console.log(category)

const setDisplay = (id)=>{
  axios.get(`http://localhost:3000/products/${id}`)
    navigate(`/product/${id}`)
}

//fetch products
      useEffect(() => {
        let isMounted = true;
        const fetchProducts = async () => {
      try {
        let url = "http://localhost:3000/products";
        
       
        if (category && category !== "all") {
          url += `/category/${category}`;
        }

        const response = await axios.get(url);
        
        if (isMounted) {
          setProducts(response.data.products || []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error:', err);
          setError("Błąd ładowania produktów");
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
}, [category]);
   if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
                <p className="ml-3">Loading product...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-danger">Error loading product</h2>
                <p className="text-default-500">{error}</p>
            </div>
        );
    }

  return (
    <>
    <div className="flex align-start justify-center gap-[1.5rem] ">
    <SideBar></SideBar>
   
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 w-[100%] mr-[10%]  mt-[3rem] gap-[1rem]">
     
      {products.map((product, index) => (
        /* eslint-disable no-console */
        <Card key={index} isPressable shadow="sm" className="px-2 max-h-[20rem]" >
          <CardBody className="overflow-visible p-0">
            <Image
              className="w-full object-cover h-[140px]"
              onClick={()=>setDisplay(product._id)}
              radius="lg"
              shadow="sm"
              src={`http://localhost:3000${product.images}`}
              width="100%"
            />
             <p className="text-default-500 mt-[1rem] ml-[.5rem] mb-[.5rem]" onClick={()=>setDisplay(product._id)}>{product.name}</p>
          </CardBody>
          <p className="text-xl text-[#7828C8] text-left ml-[.5rem] ">{product.price} zł</p>
          <CardFooter className="text-small justify-start">
           
           <div>
             <Tooltip content="Add to cart" showArrow={true} >
                <FaCartPlus className="size-[2rem] mr-[.5rem] ml-[-0.5rem] radius-100 bg-[rgba(0,0,0,.1)] px-[.5rem] py-[.5rem] rounded-[100%] text-default-600"/>
              </Tooltip>
           </div>
            
            <Tooltip content="Add to favorites" showArrow={true}>
                <FaHeart className="size-[2rem] mr-[.5rem]  radius-100 bg-[rgba(0,0,0,.1)] px-[.5rem] py-[.5rem] rounded-[100%] text-[#7828C8]" />
            </Tooltip>
        </CardFooter>
           
      </Card>
      ))}
    </div>
     </div>
    </>
  );
}

export default ProductCard