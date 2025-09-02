import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { Image, Button, Spinner } from "@heroui/react";
import { FaCartPlus, FaHeart, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router';

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
                
                // SPRÓBUJ RÓŻNYCH ŚCIEŻEK:
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
                    onClick={() => navigate(-1)}
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
                    onClick={() => navigate(-1)}
                    className="mt-4"
                >
                    <FaArrowLeft className="mr-2" /> Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            {/* Przycisk powrotu */}
            <Button 
                color="default" 
                variant="light" 
                onPress={() => navigate(-1)}
              
            >
                <FaArrowLeft className="mr-2" /> Back to Products
            </Button>
 <p className="text-[4rem] mb-[1rem] mt-[0]">{product.name}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

                {/* Zdjęcie produktu */}
                <div className="flex justify-center align-center">
                    <Image
                        src={`http://localhost:3000${product.images}`}
                        alt={product.name}
                        className="rounded-lg shadow-lg w-full object-cover h-[500px]"
                        onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNjY2Ij5CcmFrIG9icmF6dTwvdGVx0D48L3N2Zz4=';
                        }}
                    />
                    
                </div>
                <div>
                 
                 
                    <h2>{product.description}</h2>
                    
                   
                </div>
                
               <div className="flex flex-col justify-space-between align-end  gap-[1rem] ">
                <p className="text-[2.5rem]">{product.price} zł</p>
                  <Button size="md">Dodaj do koszyka</Button>
                  <Button size="md">Dodaj do ulubionych</Button> 
                  </div>
            </div>
              
        </div>
    );
}

export default Product;