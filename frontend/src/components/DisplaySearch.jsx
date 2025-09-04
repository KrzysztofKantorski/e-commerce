import React from 'react'
import {useState, useEffect} from "react"
import axios from "axios"
import LoadingData from "./handleData/LoadingData"
import {Listbox, ListboxItem} from "@heroui/react";
import { useScroll } from '../hooks/useScroll';
import { FaRegFaceSadCry } from "react-icons/fa6";
const ListboxWrapper = ({children}) => (
  <div className="w-full max-w-[100%]  border-small  rounded-small border-default-200 dark:border-default-100 " 
  >
    {children}
  </div>
);


function DisplaySearch({search}) {
    const [searchedProducts, setSearchedProducts] = useState([]);
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);
  
    const isScrolled = useScroll();
    

    useEffect(() => {
        setError(null);
        setNoResults(false);
        let isMounted = true;
        const fetchProducts = async () => {

        if (search.trim() === "") {
              if (isMounted) {
                  setSearchedProducts([]);
                  setLoading(false);
             
              }
              return;
        }

      setLoading(true);

      try {
        let url = "http://localhost:3000/products";
        
        if (search == "") {
          setError("type something to find")
        }
        url += `/search?q=${search}`
        const response = await axios.get(url);
        
       
          if(response.data.products.length == 0){
           
            setNoResults(true);
            setSearchedProducts([])
          }
          else{
            setSearchedProducts(response.data.products);
            
          }
        

      } catch (err) {
        if (isMounted) {
             
                    
                    if (err.response) {
                        // Error types
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
                    } else if (err.request) {
                        // No response
                        setError("Brak połączenia z serwerem. Sprawdź swoje połączenie internetowe");
                    } else {
                        // Different error
                        setError("Wystąpił nieoczekiwany błąd");
                    }
                    setSearchedProducts([]);
                    setNoResults(true);
      
      } 
    }
      finally{
        setLoading(false)
      }
    };
       const timeout =  setTimeout(fetchProducts, 100);

    return () => {
      isMounted = false;
      clearTimeout(timeout)
    };
}, [search]);

 if (error) {
      console.log(error)
  }

  if (loading) {
        return (
          <LoadingData title={loading}></LoadingData>
        );
  }

  

  let containerClass = isScrolled?  "fixed top-[4rem] z-50 w-[30%] left-[35%] bg-background shadow-xl border-b": "absolute left-[35%] right-0 z-50 w-[30%] top-[4rem] mt-0 bg-background shadow-xl border-b"
  

if(noResults){
    return(
       <div className={containerClass} >
        <div className="w-[full] text-center flex flex-col align-center justify-center px-[2rem] py-[2rem] border-b">
          <h2 className="text-lg  text-default-500 mb-[1rem]">Nie znaleziono żadnego produktu</h2>
         <div>
              <FaRegFaceSadCry className="text-[5rem] text-center w-full text-primary" />
         </div>
        
        </div>
       
      </div>
    )
  }
if (search.trim() === "") {
        return null;
  }

  return (
<>
  <div className={containerClass}
  >
      <ListboxWrapper>
        <Listbox
          isVirtualized
          className="w-full"
          itemClasses={{
        base: "px-3 w-full ",
      }}
          label="Wyniki wyszukiwania"
          placeholder="Select..."
          virtualization={{
            maxListboxHeight: 250,
            itemHeight: 70,
          }}
        >
          <ListboxItem className="relative bg-primary text-white" >
            <div>Znaleziono: {searchedProducts.length} produktów</div>
            </ListboxItem>
          {searchedProducts.map((product, index) => (
            <ListboxItem className="relative "
              key={product._id || index} 
              
              textValue={product.name}
            >
            
              <div className="mb-[1rem]">
                <div className="text-md font-medium truncate">{product.name}</div>
                <div className="text-sm text-default-500">{product.price} zł</div>
              </div>

                <img 
                src={`http://localhost:3000${product.images}`}
                width="15"
                height="15"
                className="w-15 h-15 object-cover rounded absolute top-[.3rem] bottom-[.1rem] right-[2rem]"
                alt={product.name}
              />
            </ListboxItem>
          ))}
        </Listbox>
      </ListboxWrapper>
      </div>
    </>
  )
}

export default DisplaySearch