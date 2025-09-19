import React from 'react'
import axios from "axios"
import {useState, useEffect} from "react"
import {useNavigate} from "react-router"
import AnimatedBackground from '@/components/AnimatedBackground'
import TextGlitchAnimation from '@/components/TextGlitchAnimation'
import {Image} from "@heroui/react";
import {Accordion, AccordionItem} from "@heroui/react";
import Cookies from "universal-cookie"
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@heroui/table";
const cookies = new Cookies();
function ShowOrders() {
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);
const [order, setOrder] = useState([]);
const navigate = useNavigate(); 
useEffect(()=>{
  const displayTotal = async ()=>{
  setLoading(true);
  setOrder([])
    try{
        const token = cookies.get("TOKEN");
        if (!token) {
          alert("Musisz być zalogowany aby złożyć zamówienie");
          navigate("/Login");
          return;
        }
      const url = "http://localhost:3000/orders";
      const response = await axios.get(url, {
      headers: {
      Authorization: `Bearer ${token}`,
      }});
      if(response.status == 200){
        const orders = response.data.orders;
        setOrder(orders);   
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
<AnimatedBackground></AnimatedBackground>
<TextGlitchAnimation text={"Zamówienia"}></TextGlitchAnimation>
<div className="w-[50%] min-h-[10rem] ml-[25%] z-[10] relative text-right">
    {order.map((item, index)=>(
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