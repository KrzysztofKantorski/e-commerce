import React from 'react'
import AnimatedBackground from '@/components/AnimatedBackground'
import Cookies from "universal-cookie"
import LoadingData from '@/components/handleData/LoadingData';
import Error from '@/components/handleData/Error';
import {useState, useEffect} from "react"
import {useNavigate} from "react-router"
import TextGlitchAnimation from '@/components/TextGlitchAnimation';
import {Form, Image, Button} from "@heroui/react"
import {NumberInput} from "@heroui/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@heroui/table";
import { FaArrowRight } from "react-icons/fa";
import axios from "axios"
const cookies = new Cookies();
function CartProducts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [data, setData] = useState([])
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState()
  const updateQuantity = async ()=>{
   
   alert("git")

  }
  useEffect(()=>{   
    setLoading(true)
    setData([])
    const displayCart = async()=>{
      try{
        const token = cookies.get("TOKEN");
            if(!token){
                alert("Musisz być zalogowany aby zarządzać koszykiem");
                navigate("/Login");
                return;
            }
            const url = `http://localhost:3000/cart`;
            const response = await axios.get(url, {
            headers: {
            Authorization: `Bearer ${token}`
            }

           
        });
        
          console.log(data)
          console.log(response.data.cart)
         if(response.status == 200){
               if (response.data.cart) {
                setData(response.data.cart);
                
                console.log("✅ Znaleziono response.data.reviews");
              console.log(data)
            } 
          }
      }
      catch(error){
        console.log(error.message);
        setError(true)
      }
      finally{
        setLoading(false)
      }
    }
    displayCart();
  }, [])

  if(loading){
    return (
      <LoadingData></LoadingData>
    )
  }

  if(error){
    <Error></Error>
  }
  return (
    <>
     <AnimatedBackground gradientStyle={"to_bottom_right"}/>
     
  <div className=" min-h-[100vh] flex items-center justify-start flex-col w-[80%] ml-[10%] relative">
      <TextGlitchAnimation text={"Koszyk"}></TextGlitchAnimation>
      
      
      <div className="relative w-full text-right">
         <Button color="primary" className="mb-[1rem]"><FaArrowRight /></Button>
        <Table aria-label="Example static collection table" className="realtive z-[10]">
        <TableHeader>
          <TableColumn>Nazwa</TableColumn>
          <TableColumn>Zdjęcie</TableColumn>
          <TableColumn>Cena</TableColumn>
          <TableColumn>Ilość</TableColumn>
          <TableColumn>Usuń</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"Brak produktów w koszyku"}>
          {data.map((item, index)=>(
            <TableRow key={index} className={index % 2 === 0 ? "bg-grey-50" : "bg-accent"}>
            <TableCell>{item.product.name}</TableCell>
            <TableCell>
              
              <Image
              src={`http://localhost:3000${item.product.images}`}
              alt={item.product.name}
              className="rounded-lg shadow-lg w-[3rem] object-cover h-[3rem]"
              /> 
            </TableCell>
            <TableCell>{item.product.price}</TableCell>
            <TableCell>
              
                  <NumberInput
                    isRequired
                    value={item.quantity}
                    label="Amount"
                    name="amount"
                    placeholder="Enter a number"
                    onChangeValue={updateQuantity}
                  />
               
            </TableCell>
            <TableCell>Usuń</TableCell>
          </TableRow>
        
      )
        
      )}
          
        </TableBody>
      </Table>
    </div>

      </div>
      
    
  
     

    </>
    
  )
}

export default CartProducts