import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { Image, Button, Spinner } from "@heroui/react";
import { FaCartPlus, FaHeart, FaArrowLeft } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router';
import { FaStar } from "react-icons/fa"
import { FaComment } from "react-icons/fa";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import CountStars  from "../components/CountStars";
import DisplayProductDescription from "../components/DisplayProductDescription";
import DisplayComments from "../components/DisplayComments";
import { HyperText } from "@/components/magicui/hyper-text";

function Product() {
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null)
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    //get product id
    const {id} = useParams();
    useEffect(() => {
        setLoading(true);
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/products/${id}`);
                console.log("Full response:", response);
                console.log("Response data:", response.data);
                
                
                const productData = response.data.product || response.data || null;
                setProduct(productData);
                
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching product: ", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);


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
                <Button 
                    color="primary" 
                    variant="flat" 
                    onPress={() => navigate(-1)}
                    className="mt-4"
                >
                    <FaArrowLeft className="mr-2" /> Go Back
                </Button>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-warning">Product not found</h2>
                <Button 
                    color="primary" 
                    variant="flat" 
                    onPress={() => navigate(-1)}
                    className="mt-4"
                >
                    <FaArrowLeft className="mr-2" /> Go Back
                </Button>
            </div>
        );
    }

    return (
        <>
    <div className="fixed inset-0 z-[1] ">
        <AnimatedGridPattern
            numSquares={200}
            maxOpacity={0.5}
            duration={1}
            repeatDelay={1}
            className={cn(
            "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]",
            "absolute inset-0 w-full h-full text-primary"
            )}
        />
    </div>
        <div className="container mx-auto p-3 max-w-6xl z-[1]" >
            
            <Button 
            color="default" 
            variant="light" 
            onPress={() => navigate(-1)}
            className="z-100"
            >
                <FaArrowLeft className="mr-2" /> Back to Products
            </Button>

             <div className="grid grid-cols-1  md:grid-cols-2  gap-1 items-start  mt-[.5rem] ">
            
             <Image
            src={`http://localhost:3000${product.images}`}
            alt={product.name}
            className="rounded-lg shadow-lg w-[500px] object-cover h-[600px]"
            /> 
           

            
            <div className="grid grid-cols-1 md:grid-cols-1 gap-5 items-start z-[1]">
                <p className="text-[3.5rem]">{product.name}</p>
                <div className="flex items-center justify-start text-[1.5rem] z-[1]">
                  <CountStars rating={product.averageRating}> </CountStars>

                    <div className="border px-[.5rem] rounded-sm flex items-center justify-center gap-2 ml-[.5rem]  ">
                        <FaComment color="oklch(47.655% 0.23035 318.675)"/>
                        <span>{product.reviews.length}  </span>
                    </div>
                     
                </div>
             
               <div className="flex flex-col justify-space-between align-end  gap-[1rem] z-[1]">
                <p className="text-[2.5rem]">{product.price} zł</p>
                <div>
                    <Button size="md" color="primary" className="mr-[1rem]">Dodaj do koszyka</Button>
                  <Button size="md" color="primary">Dodaj do ulubionych</Button> 
                </div>
                </div>
                
            </div>
           
    </div>
           <div className="mt-[1rem] z-[1]" >
            <HyperText duration={1000} className="relative text-primary text-center text-[6rem] z-[1000]">Dane techniczne</HyperText>
              <DisplayProductDescription description={product.description} className="z-[10] relative"></DisplayProductDescription>
            </div>  

            <div className="mt-[1rem] z-[1]" >
                 <HyperText duration={1000} className="relative text-primary text-center text-[6rem] z-[1000]">Opinie</HyperText>
                 
           
                 <DisplayComments id={product._id}></DisplayComments>
            </div>
</div>

</>
    );
}

export default Product;