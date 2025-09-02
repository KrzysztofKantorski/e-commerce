import {Listbox, ListboxItem} from "@heroui/react";
import {useState, useEffect} from "react";
import axios from "axios"
import { useContext } from 'react';
import { useCategory } from "../Context/CategoyContext";

import {Spinner} from "@heroui/react"


import { CoolMode } from "../components/MagicUi/cool-mode";
import {Button, ButtonGroup} from "@heroui/button";


import { SpinningText } from "../components/magicui/spinning-text";

export const ItemCounter = ({number}) => (
  <div className="flex items-center gap-1 text-default-400">
    <span className="text-small">{number}</span>
  </div>
);


export default function SideBar() {
const [product, setProduct] = useState([]);
const [error, setError] = useState(null);
const [loading, setLoading] = useState(false)
const { category, setCategory } = useCategory();


useEffect(()=>{
  setLoading(true)
    const fetchCount = async()=>{
  try{

    const response = await axios.get(`http://localhost:3000/products/category/count`);
    console.log(response.data.count);
    setProduct(response.data.count)
  }

  
  catch(err){
    console.error('Error:', err);
    setError("Błąd ładowania produktów");
    setProducts([]);

  }finally{
    setLoading(false)
  }
}
  fetchCount();
}, [])


if (error) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-danger">Error loading product</h2>
                <p className="text-default-500">{error}</p>
            </div>
        );
}

 if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
                <p className="ml-3">Loading product...</p>
            </div>
        );
}
  return (

    <div className="height-[600px]  mt-[3rem] ml-[10%]">

    <Listbox
      aria-label="Title"
      className="p-0 gap-0 divide-y max-w-[500px] min-w-[250px] overflow-visible bg-[rgba(120,40,200,0.5)] rounded-medium"
      itemClasses={{
        base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-14 ",
      }}>
      
      <ListboxItem>
      Wyszykaj na podstawie kategorii
      </ListboxItem>
      
      </Listbox>
      <Listbox
      aria-label="User Menu"
      className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 max-w-[500px] min-w-[250px] overflow-visible shadow-small rounded-medium"
      itemClasses={{
        base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-1 h-12 data-[hover=true]:rgba(195, 0, 255, 0.5)",
      }}
      onAction={(siup)=>setCategory(siup)}>
      
      {product.map((prod, index)=>(
        <ListboxItem
        siup={prod.count}
        key={prod.cat}
        endContent={<ItemCounter number={prod.count} />}
      >
        {prod.cat}
      </ListboxItem>
      ))}
      <ListboxItem
       
        key="all"
        
      >
        wszystkie
      </ListboxItem>
     </Listbox>


      <Listbox
      aria-label="Filter"
      className="p-0 gap-0 divide-y max-w-[500px] min-w-[250px] mt-[1.5rem] overflow-visible bg-[rgba(120,40,200,0.5)] rounded-medium"
      itemClasses={{
        base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-14 ",
      }}>
      
      <ListboxItem>
      Filtry
      </ListboxItem>
      
      </Listbox>


 <div className="relative justify-center">
       <div className="relative justify-center">
      <CoolMode>
        <Button>Click</Button>
      </CoolMode>
      <SpinningText className="text-[2rem] bg-[rgba(120,40,200,0.5)]" style={{
        color: "rgba(120,40,200,0.5)"
      }}>
       
          Siup nowy komponencik
         
      </SpinningText>
    </div>
    </div>
     </div>
  );
}

