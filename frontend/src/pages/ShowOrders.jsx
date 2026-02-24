import React from 'react'
import axios from "axios"
import {useState, useEffect} from "react"
import {useNavigate} from "react-router"
import TextGlitchAnimation from '@/components/TextGlitchAnimation'
import {Image} from "@heroui/react";
import {Accordion, AccordionItem} from "@heroui/react";
import order from '../api/order';
import handleApiError from '@/api/handleApiError';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@heroui/table";

function ShowOrders() {
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);
const [orders, setOrders] = useState([]);
const navigate = useNavigate(); 
useEffect(()=>{
  const displayTotal = async ()=>{
  setLoading(true);
  setOrders([])
    try{
      const response = await order.displayOrders();
      if(response.status == 200){
        const userOrders = response.data.orders;
        setOrders(userOrders);   
      }
    }
    catch(error){
      setError(error.message)
    }
    finally{
      setLoading(false);
    }
  }
displayTotal();
}, [])

return (
<>

<TextGlitchAnimation text={"Zamówienia"}></TextGlitchAnimation>
<div className="w-[90%] min-h-[10rem] ml-[5%] z-[10] relative text-right lg:w-[50%] lg:ml-[25%]">
    {orders.map((item, index)=>(
    <>
    <Accordion>
      <AccordionItem key="1" aria-label="Zamówienie" title={`Zamówienie: ${new Date(item.createdAt).toLocaleDateString('pl-PL')}`} className="text-left">
        <Table aria-label="Order" className="realtive z-[10]">
            <TableHeader>
              <TableColumn>Nazwa</TableColumn>
              <TableColumn>Zdjęcie</TableColumn>
              <TableColumn>Cena</TableColumn>
              <TableColumn>Ilość</TableColumn>
            </TableHeader>
          <TableBody emptyContent={"Brak produktów w koszyku"}>
            {item.products.map((productItem, index)=>{
              const product = productItem.product; 
              const quantity = productItem.quantity; 
              if (!product) {
                return (
                  <TableRow key={index}>
                    <TableCell colSpan="4" className="text-center text-default-500">
                      Produkt został usunięty
                    </TableCell>
                  </TableRow>
                );
              }
              return(
                <TableRow key={index} className={index % 2 === 0 ? "bg-grey-50" : "bg-accent"}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                      <Image
                      src={`http://localhost:3000${product.images}`}
                      alt={product.name}
                      className="rounded-lg shadow-lg w-[3rem] object-cover h-[3rem]"
                      /> 
                  </TableCell>
                  {product.discount>0?(
                  <TableCell>
                    {product.discount} zł      
                  </TableCell>
                  ):(
                  <TableCell>
                    {product.price} zł      
                  </TableCell>
                  )}
                  
                  <TableCell>
                    <span>{quantity}</span>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
        </Table>
          <h1 className="mt-[1rem] text-primary text-right">Metoda płatności: {item.payment}</h1>
          <h1 className="mt-[1rem] text-primary text-right">Zapłacono: {item.totalPrice} zł</h1>
        </AccordionItem>
    </Accordion>
  </>
  ))}
</div>
</>
)}

export default ShowOrders