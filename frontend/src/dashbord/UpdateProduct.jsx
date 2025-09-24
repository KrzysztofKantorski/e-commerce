import React from 'react'
import SideBar from "./SideBar"
import {Button, ButtonGroup} from "@heroui/react";
import {useNavigate} from "react-router"
import {Input} from "@heroui/react";
import {useState, useEffect} from "react"
import Card from "./Card"
import Error from '@/components/handleData/Error';
import {FaRegFaceSadCry} from "react-icons/fa6"
import axios from "axios"
import {useRef} from "react"
import UpdateForm from "./UpdateForm" 
import Hamburger from './Hamburger';
function UpdateProduct() {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");
    const [error, setError] = useState(null);
    const [noResults, setNoResults] = useState(false);
    const [searchedProducts, setSearchedProducts] = useState([]);
    const [change, setChange] = useState("")
    const [loading, setLoading] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showResults, setShowResults] = useState(false)
useEffect(() => {
    
  setError(null);
  setNoResults(false);
setShowResults(false);
  let isMounted = true;
  setLoading(true);
  const fetchProducts = async () => {
    if (searchText.trim() === "") {
      if (isMounted) {
          setSearchedProducts([]);
          setShowResults(false);
          setLoading(false);
        }
    return;
    }

    setShowResults(true);
      try {
        let url = "http://localhost:3000/products";
        
        if (searchText == "") {
          setError("type something to find")
        }
        url += `/search?q=${searchText}`
        const response = await axios.get(url);
          if(response.data.products.length == 0){
            setNoResults(true);
            setSearchedProducts([]);
            console.log("Nie znaleziono produktu")
          }
          else{
            setSearchedProducts(response.data.products);
            setNoResults(false)
          }
          
      } catch (err) {
        if (isMounted) {
            if (err.response) {
              switch (err.response.status) {
                case 404:
                  setError("Endpoint wyszukiwania nie został znaleziony");
                  break;
                case 500:
                  setError("Błąd serwera. Spróbuj ponownie później");
                  break;
                default:
                  setError("Wystąpił błąd podczas wyszukiwania");
              }
            } 
            else if (err.request) {
              
              setError("Brak połączenia z serwerem. Sprawdź swoje połączenie internetowe");
            } 
            else {
              setError("Nie znaleziono produktów");
            }
            setSearchedProducts([]);
            
            setNoResults(true);
      } 
    }
      finally{
        setLoading(false)
      }
    };

    setTimeout(fetchProducts, 300);
    return () => {
      isMounted = false;
    };
}, [searchText]);

 const updateSelectedProduct = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/products/${id}`);
            setSelectedProduct(response.data.product);
            setShowResults(false)
            console.log(response.data.product);
        } catch (error) {
            console.error("Błąd podczas pobierania produktu:", error);
        }
    };

if(error){
    <Error></Error>
}


  return (
    
    <div className="flex w-full min-h-[100vh] gap-5">
        <SideBar></SideBar>
        <Hamburger></Hamburger>
        <div className="flex flex-col items-center justify-start w-full gap-5 mt-[2rem]">
            <h1 className="text-lg">Zarządzanie produktami</h1>
            <ButtonGroup>
                <Button onPress={()=>{navigate("/AddProduct")}}>Dodaj</Button>
                <Button onPress={()=>{navigate("/UpdateProduct")}}>Zmień</Button>
                <Button onPress={()=>{navigate("/DeleteProduct")}}>Usuń</Button>
            </ButtonGroup>

            <div className="flex flex-col w-full justify-center items-center">
                 <h1 className="text-xl mb-[2rem]">Zaktualizuj produkt</h1>
                <Input
                classNames={{
                base: "sm:w-[15rem] md:w-[17rem] lg:w-[20rem] xl:w-[25rem] h-10",
                mainWrapper: "h-full w-full",
                input: "text-small",
                inputWrapper:
                    "h-full w-full font-normal text-default-500 bg-default-400/20",
                    }}
                placeholder="Wyszukaj..."
                size="sm"
                
                type="search"
                value={searchText}
                onChange={(e)=>setSearchText(e.target.value)}
                />
               {showResults  && searchText.trim() !== "" && (
                        <>
                            {noResults ? (
                                <div className="text-center flex flex-col px-8 py-8 border-b mt-4">
                                    <h2 className="text-lg text-default-500 mb-4">Nie znaleziono żadnego produktu</h2>
                                    <FaRegFaceSadCry className="text-5xl text-primary mx-auto" />
                                </div>
                            ) : (
                                <div className="w-[800px] mt-4 lg:w-full">
                                    <Card searchedProducts={searchedProducts} 
                                        onProductSelect={updateSelectedProduct}/>
                                </div>
                            )}
                        </>
                    )}

                {selectedProduct && (
                    <div className="w-full mt-6">
                        <UpdateForm product={selectedProduct} />
                    </div>
                )}
            </div>
            
        </div>
    </div>
  )
}

export default UpdateProduct