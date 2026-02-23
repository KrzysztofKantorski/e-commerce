import React from 'react'
import {useState, useEffect } from 'react';
import {useParams } from 'react-router';
import {Image, Button, Spinner } from "@heroui/react";
import {FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router';
import { FaComment } from "react-icons/fa";
import CountStars  from "../components/CountStars";
import DisplayProductDescription from "../components/DisplayProductDescription";
import DisplayComments from "../components/DisplayComments";
import TextGlitchAnimation from '@/components/TextGlitchAnimation';
import Recommendations from '@/components/Recommendations';
import Nav from "../components/Nav"
import favorites from '../api/favorites';
import product from '../api/product';
import handleApiError from '../api/handleApiError';
import { useCategory } from '../Context/CategoyContext';
import cart from '../api/cart';
function Product() {
    const {newProduct, setNewProduct, addToCart, setAddToCart} = useCategory();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState(null)
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const {id} = useParams();
    const {clearErrors, handleError, fieldErrors, globalError} = handleApiError()
    const handleAddToFavorites = async (productId) => {
    try{
    clearErrors();
    const result = await favorites.addToFavorites(productId);
    setNewProduct(prev => [...prev, productId]);
    alert("Produkd został dodany do ulubionych"); 
    
    }catch(error){
        handleError(error);
        console.log(globalError)
    }
    
    
    };

    const handleCart = async (productId) => {
      try{
        await cart.addCartProduct(productId);
        alert("Produkt został dodany do koszyka");
        setAddToCart({product})
        
      }catch(error){
        
        handleError(error);
        console.log(error)
      }
    };

    useEffect(() => {
        setLoading(true);
        const fetchProduct = async () => {
            try {
                const response = await product.displayProduct(id);
                const productData = response.data.product || response.data || null;
                setProducts(productData);
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

    if (globalError !="") {
       alert(globalError);
    }

    if (!products) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-warning">Product not found</h2>
                <Button 
                    color="primary" 
                    variant="flat" 
                    onPress={() => navigate("/")}
                    className="mt-4"
                >
                    <FaArrowLeft className="mr-2" /> Go Back
                </Button>
            </div>
        );
    }

    return (
        <>
    
    <Nav></Nav>
        <div className="container mx-auto p-3 max-w-6xl z-[1]" >
        <div className="grid grid-cols-1  md:grid-cols-2  gap-1 items-start  mt-[.5rem] ">
             <Image
            src={`http://localhost:3000${products.images}`}
            alt={products.name}
            className="rounded-lg shadow-lg w-[500px] object-cover h-[600px]"
            /> 

            <div className="grid grid-cols-1 md:grid-cols-1 gap-5 items-start z-[1]">
                <p className="text-[3.5rem]">{products.name}</p>
                <div className="flex items-center justify-start text-[1.5rem] z-[1]">
                  <CountStars rating={products.averageRating}> </CountStars>

                    <div className="border px-[.5rem] rounded-sm flex items-center justify-center gap-2 ml-[.5rem]  ">
                        <FaComment color="oklch(47.655% 0.23035 318.675)"/>
                        <span>{products.reviews.length}  </span>
                    </div>
                     
                </div>
             
               <div className="flex flex-col justify-space-between align-end  gap-[1rem] z-[1]">
                {products.discount >0 ?(
                    <p className="text-[2.5rem]">{products.discount} zł</p>
                ):(
                    <p className="text-[2.5rem]">{products.price} zł</p>
                )}
                
                <div>
                  <Button size="md" color="primary" className="mr-[1rem]" onPress={()=>handleCart(products._id)}>Dodaj do koszyka</Button>
                  <Button size="md" color="primary" onPress={()=>handleAddToFavorites(products._id)}>Dodaj do ulubionych</Button> 
                </div>
                </div>
                
            </div>
           
    </div>
           <div className="mt-[1rem] z-[1]" >
          <TextGlitchAnimation text={"Dane techniczne"}></TextGlitchAnimation>
              <DisplayProductDescription description={products.description} className="z-[10] relative"></DisplayProductDescription>
            </div>  

            <div className="mt-[1rem] z-[1]" >
                 <DisplayComments id={products._id}></DisplayComments>
            </div>

             <div className="mt-[1rem] z-[1]" >
                <TextGlitchAnimation text={"Rekomendacje"}></TextGlitchAnimation>
               <Recommendations category={products.category} id={products._id}></Recommendations>
            </div>
            
</div>

</>
    );
}

export default Product;