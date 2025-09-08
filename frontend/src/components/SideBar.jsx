import {Listbox, ListboxItem} from "@heroui/react";
import {useState, useEffect} from "react";
import axios from "axios"
import { useCategory } from "../Context/CategoyContext";
import {Chip} from "@heroui/chip";
import {Spinner} from "@heroui/react"
import Filter from "./Filter"
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
    setProduct(response.data.count)
  }

  catch(err){
    
    setError("Błąd ładowania produktów");
    setProduct([]);

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
          <div className="height-[600px]  mt-[3rem] ml-[10%]">

   <Chip className="shadow-small rounded-medium py-[1.5rem] max-w-[500px] min-w-[250px] text-center  bg-primary text-[rgb(255,255,255)] h-8">Wyszukaj na podstawie kategorii</Chip>
      <Listbox
      aria-label="User Menu"
      className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 max-w-[500px] min-w-[250px] overflow-visible shadow-small rounded-medium"
      itemClasses={{
        base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-1 h-12 data-[hover=true]:rgba(195, 0, 255, 0.5)",
      }}
      onAction={(siup)=>setCategory(siup)}>
        <ListboxItem key="agd">
        agd
      </ListboxItem>
      <ListboxItem key="akcesoria">
        akcesoria
      </ListboxItem>
      <ListboxItem key="audio">
        audio
      </ListboxItem>
      <ListboxItem key="elektronika">
        elektronika
      </ListboxItem>
      <ListboxItem key="foto-video">
        foto-video
      </ListboxItem>
      <ListboxItem key="gaming">
        gaming
      </ListboxItem>
      <ListboxItem key="moda">
        moda
      </ListboxItem>
      <ListboxItem key="siup">
        siup
      </ListboxItem>

      <ListboxItem key="sport">
        sport
      </ListboxItem>
      <ListboxItem key="wearables">
        wearables
      </ListboxItem>
      <ListboxItem key="all">
        wszytskie
      </ListboxItem>
     </Listbox>

      <Filter></Filter>
     </div>
        )
}
  return (

    <div className="height-[600px]  mt-[3rem] ml-[10%]">

   <Chip className="shadow-small rounded-medium py-[1.5rem] max-w-[500px] min-w-[250px] text-center  bg-primary text-[rgb(255,255,255)] h-8">Wyszukaj na podstawie kategorii</Chip>
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
        endContent={<ItemCounter number={prod.count} />}>
      
        {prod.cat}
      </ListboxItem>
      ))}


      <ListboxItem key="all">
        wszystkie
      </ListboxItem>
     </Listbox>

      <Filter></Filter>
     </div>
  );
}

