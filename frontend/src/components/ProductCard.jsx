import React from 'react'
import {useState, useEffect} from "react"
import {Card, CardBody, CardFooter, Image, Tooltip, Button} from "@heroui/react";
import { FaCartPlus } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import axios from "axios"
import { Outlet, Link } from "react-router";
import { useNavigate } from 'react-router';
function ProductCard() {
const [products, setProducts] = useState([]);
const navigate = useNavigate(); // Hook do nawigacji
//display specific product
const setDisplay = (id)=>{
  axios.get(`http://localhost:3000/products/${id}`)
    navigate(`/product/${id}`)
}

//fetch products
      useEffect(() => {
        let isMounted = true;
        
        axios.get("http://localhost:3000/products")
            .then(response => {
                if (isMounted && response.data) {
                    setProducts(response.data.products);
                }
            })
            .catch(err => {
                if (isMounted) {
                    console.error('Error:', err);
                }
            });
            
        return () => {
            isMounted = false; 
        };
}, []);

  return (
    <div className="gap-2 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 w-[80%] ml-[10%] mt-[3rem] gap-[1rem]">
      {products.map((product, index) => (
        /* eslint-disable no-console */
        <Card key={index} isPressable shadow="sm" className="px-2" onClick={()=>setDisplay(product._id)}>
          <CardBody className="overflow-visible p-0">
            <Image
              className="w-full object-cover h-[140px]"
              radius="lg"
              shadow="sm"
              src={`http://localhost:3000${product.images}`}
              width="100%"
            />
             <p className="text-default-500 mt-[1.5rem] ml-[.5rem]">{product.name}</p>
          </CardBody>
          <p className="text-default-500 text-left ml-[.5rem]">{product.price}</p>
          <CardFooter className="text-small justify-start">
           
           <div className="mr-[.5rem]">
             <Tooltip content="Add to cart" showArrow={true} >
                <FaCartPlus className="size-[1.2rem] mr-[1rem]" />
                </Tooltip>
           </div>
            
                <Tooltip content="Add to favorites" showArrow={true}>
                <FaHeart className="size-[1.2rem]" />
                </Tooltip>
          </CardFooter>
           
        </Card>
      ))}
    </div>
  );
}

export default ProductCard