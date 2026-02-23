import React from 'react'
import {useState, useEffect} from "react"
import {useNavigate} from "react-router"
import LoadingData from "./handleData/LoadingData"
import {Listbox, ListboxItem} from "@heroui/react";
import { useScroll } from '../hooks/useScroll';
import { FaRegFaceSadCry } from "react-icons/fa6";
import handleApiError from '@/api/handleApiError'

import product from '@/api/product'
const ListboxWrapper = ({children}) => (
  <div className="w-full max-w-[100%]  border-small  rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);

function DisplaySearch({search}) {
const navigate = useNavigate();
const [searchedProducts, setSearchedProducts] = useState([])
const [loading, setLoading] = useState(false)
const [noResults, setNoResults] = useState(false)
const isScrolled = useScroll()
const {clearErrors, handleError, fieldErrors, globalError} = handleApiError()
const setDisplay = (id)=>{
  try{
    clearErrors();
    product.displayProduct(id)
    navigate(`/product/${id}`)
    
  }catch(error){
    handleError(error);
    console.log(globalError);
  }
}
   
useEffect(() => {
  setNoResults(false);
  let isMounted = true;
  setLoading(true);
  const fetchProducts = async () => {
    if (search.trim() === "") {
      if (isMounted) {
          setSearchedProducts([]);
          setLoading(false);
        }
    return;
    }
      try {
        if (search == "") {
          return;
        }
        const response = await product.findProduct(search);
        if(response.data.products.length == 0){
            setNoResults(true);
            setSearchedProducts([]);
            console.log("Nie znaleziono produktu")
        }
        else{
            setSearchedProducts(response.data.products);
            
        }
          
      } catch (err) {
        handleError(err);
        setSearchedProducts([]);
        setNoResults(true);
    }
      finally{
        setLoading(false)
      }
    };

    fetchProducts()
   
}, [search]);

 if (globalError != "") {
      console.log(globalError)
  }

  let containerClass = isScrolled?  
  "fixed top-[4rem] z-50 w-[90%] left-[5%] bg-background shadow-xl border-b xl:w-[30%] xl:left-[35%]": "absolute left-[5%] right-0 z-50 w-[90%] top-[4rem] mt-0 bg-background shadow-xl border-b xl:w-[30%] xl:left-[35%]"
  
if (search.trim() === "") {
        return null;
  }

  return (
<>
  <div className={containerClass}>
    {loading ? (
      <LoadingData title="Ładowanie..." />
    ) : noResults ? (
      <div className="text-center flex flex-col px-8 py-8 border-b">
        <h2 className="text-lg text-default-500 mb-4">Nie znaleziono żadnego produktu</h2>
        <FaRegFaceSadCry className="text-5xl text-primary mx-auto" />
      </div>
    ) : (
      <ListboxWrapper>
        <Listbox
        isVirtualized
          className="w-full"
          label="Wyniki wyszukiwania"
          itemClasses={{ base: "px-3 w-full" }}
          virtualization={{ maxListboxHeight: 250, itemHeight: 70 }}
        >
          {searchedProducts.map((product, index) => (
            <ListboxItem key={product._id || index} textValue={product.name} >
              <div className="mb-4" onClick={()=>{setDisplay(product._id)}}>
                <div className="text-md font-medium truncate">{product.name}</div>
                <div className="text-sm text-default-500">{product.price} zł</div>
              </div>
              <img
                src={`http://localhost:3000${product.images}`}
                className="w-15 h-15 object-cover rounded absolute top-1 right-8"
                alt={product.name}
              />
            </ListboxItem>
          ))}
        </Listbox>
      </ListboxWrapper>
    )}
  </div>
    </>
  )
}

export default DisplaySearch