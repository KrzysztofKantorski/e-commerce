import React from 'react'
import axios from "axios"
import {useState, useEffect} from "react"
import {useNavigate} from "react-router"
import TextGlitchAnimation from '@/components/TextGlitchAnimation'
import {Button} from "@heroui/react";
import {Image} from "@heroui/react";
import {Accordion, AccordionItem} from "@heroui/react";
import {RadioGroup} from "@heroui/react";
import CustomRadio from '@/components/CustomRadio'
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@heroui/table";
import order from '../api/order';
import handleApiError from '@/api/handleApiError';
import { useData } from '../Context/UserDataContext';
function OrderSuccess() {
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState("");
    const [userOrder, setUserOrder] = useState([]);
    const [adres, setAdres] = useState([]);
    const [payment, setPayment] = useState("");
    const {clearErrors, handleError, globalError} = handleApiError()
    const navigate = useNavigate(); 
    const { data } = useData();
     useEffect(()=>{
        const displayTotal = async ()=>{
             setLoading(true);
              setUserOrder([])
            try{
              clearErrors();
              if (!data || !data.username) {
                alert("Musisz się zalogować, aby dodać produkt do koszyka!");
                navigate('/');
                return; 
              }
              const response = await order.displayData();
              console.log(response)
              const orders = response.data.orders;
              const sortedOrders = orders.sort((a, b) => 
              new Date(b.createdAt) - new Date(a.createdAt)
              );
              const currentOrder = sortedOrders[0];
              setTotal(currentOrder.totalPrice);
              setUserOrder(currentOrder.products);
              setAdres(currentOrder.shippingAddress);
            }
            catch(error){
                handleError(error);
                console.log(globalError);
            }
            finally{
                setLoading(false);
            }
        }
    displayTotal();
}, [])

const finalizeOrder = async ()=>{
  clearErrors();
  if (!data || !data.username) {
    alert("Musisz się zalogować, aby dodać produkt do koszyka!");
    navigate('/');
    return; 
  }
  if(payment === ""){
    alert("wybierz metodę płatności");
    return
  }
  try{
    const response = await order.finalizeOrder(payment);
    if(response.status == 200){
      alert("Zamówienie zostało złożone");
      setTimeout(()=>{navigate("/")}, 3000)
      }
    }
  catch(error){
    handleError(error);
    console.log(globalError);
  }
}

  
  return (
<div>
    
    <TextGlitchAnimation text={"Finalizacja"}></TextGlitchAnimation>
  <RadioGroup className="w-full z-[10] relative">
      <div className="flex flex-wrap items-center justify-center gap-5">
        <CustomRadio value="blik" className="w-[10rem] h-[7rem]" onChange={()=>{setPayment("blik")}}>
          Blik
        </CustomRadio>
        <CustomRadio value="paypal" className="w-[10rem] h-[7rem]" onChange={()=>{setPayment("paypal")}}>
          Paypal
        </CustomRadio>
        <CustomRadio value="paysafecard" className="w-[10rem] h-[7rem]" onChange={()=>{setPayment("paysafecard")}}>
          Paysafecard
        </CustomRadio>
        <CustomRadio value="credit card" className="w-[10rem] h-[7rem]" onChange={()=>{setPayment("credit card")}}>
          Karta kredytowa
        </CustomRadio>
      </div>
  </RadioGroup>
  <div className="w-[50%] min-h-[10rem] ml-[25%] z-[10] relative text-right">
    <Accordion>
      <AccordionItem key="1" aria-label="Zamówienie" title="Zamówienie" className="text-left">
         <Table aria-label="Order" className="realtive z-[10]">
               <TableHeader>
                 <TableColumn>Nazwa</TableColumn>
                 <TableColumn>Zdjęcie</TableColumn>
                 <TableColumn>Cena</TableColumn>
                 <TableColumn>Ilość</TableColumn>
                 
               </TableHeader>
               <TableBody emptyContent={"Brak produktów w koszyku"}>
                 {userOrder.map((item, index)=>(
                   <>
                   <TableRow key={index} className={index % 2 === 0 ? "bg-grey-50" : "bg-accent"}>
                   <TableCell>{item.product.name}</TableCell>
                   <TableCell>
                     
                     <Image
                     src={`http://localhost:3000${item.product.images}`}
                     alt={item.product.name}
                     className="rounded-lg shadow-lg w-[3rem] object-cover h-[3rem]"
                     /> 
                   </TableCell>
                   {item.product.discount>0?(
                    <TableCell>
                    {item.product.discount}
                   </TableCell>
                   ):(
                    <TableCell>
                    {item.product.price}
                   </TableCell>
                   )}
                   
                   <TableCell>
                    <span>{item.quantity}</span>
                   </TableCell>
                 </TableRow>
                   </> 
             )
             )}
                   
        </TableBody>
      </Table>
    <h1 className="mt-[1rem] text-primary text-right">Do zapłaty: {total} zł</h1>
  </AccordionItem>
  <AccordionItem key="2" aria-label="Adres" title="Adres" className="text-left">
      <Table aria-label="Order" className="realtive z-[10]">
          <TableHeader>
            <TableColumn>Pole</TableColumn>
            <TableColumn>Dane</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"Brak produktów w koszyku"}>
                   <>
                <TableRow className={ "bg-grey-50" }>
                   <TableCell>Imię i nazwisko</TableCell>
                   <TableCell>{adres.fullName}</TableCell>
                </TableRow>
                 
                <TableRow className={"bg-accent"}>
                   <TableCell>Ulica</TableCell>
                   <TableCell>{adres.street}</TableCell>
                </TableRow>

                <TableRow className={"bg-grey-50" }>
                   <TableCell>Misato</TableCell>
                   <TableCell>{adres.city}</TableCell>
                </TableRow>

                <TableRow className={"bg-accent"}>
                   <TableCell>Kraj</TableCell>
                   <TableCell>{adres.country}</TableCell>
                </TableRow>

                <TableRow className={"bg-grey-50" }>
                   <TableCell>Kod pocztowy</TableCell>
                   <TableCell>{adres.postalCode}</TableCell>
                </TableRow>

                <TableRow className={"bg-accent"}>
                   <TableCell>Numer telefonu</TableCell>
                   <TableCell>{adres.phone}</TableCell>
                </TableRow>
                   </>
               </TableBody>
             </Table>
      </AccordionItem>
    </Accordion>
    <Button className="z-[10] relative" onPress={finalizeOrder}>Zapłać</Button>
    </div>
    </div>
  )
}

export default OrderSuccess