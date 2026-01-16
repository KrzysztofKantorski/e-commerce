import React from 'react'
import AnimatedBackground from '@/components/AnimatedBackground'
import LoadingData from '@/components/handleData/LoadingData';
import Error from '@/components/handleData/Error';
import {useState, useEffect} from "react"
import {useNavigate} from "react-router"
import TextGlitchAnimation from '@/components/TextGlitchAnimation';
import {Form, Image, Button} from "@heroui/react"
import { FaTrashAlt } from "react-icons/fa";
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
function CartProducts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [data, setData] = useState([]);
  const [updateCart, setUpdateCart] = useState([]);
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState();
  const goToOrder = ()=>{
    navigate("/Order")
  }

  const removeFromCart = async (id)=>{
        try{
            const url = `http://localhost:3000/cart/${id}`;
            const response = await axios.delete(url);

            if(response.status == 200){
                setUpdateCart(id);
                console.log(response.data.cart);
                
            }
        

            }catch(error){
                setError(error.message)
            }
  }
  const updateQuantity = async ( quantity,  id)=>{  

   console.log(typeof id)
    try{  
      const url = `http://localhost:3000/cart/${id}`;
      const response = await axios.put(url, {
         quantity :quantity
        })
       if(response.status == 200){
        console.log("success");
        setQuantity(quantity)
       }
    }
    catch(error){
      console.log(error.message)
    }

  }
  useEffect(()=>{   
    setLoading(true)
    setData([])
    const displayCart = async()=>{
      try{
        const url = `http://localhost:3000/cart`;
        const response = await axios.get(url);
         if(response.status == 200){
               if (response.data.cart) {
                setData(response.data.cart);
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
  }, [quantity, updateCart])

  const totalPrice = data.reduce((total, item) => {
    if(item.product.discount >0){
      return total + (item.product.discount * item.quantity);
    }
    else{
      return total + (item.product.price * item.quantity);
    }
}, 0);
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
         <Button color="primary" className="mb-[1rem] relative z-[10]" onPress={()=>{goToOrder()}}><FaArrowRight /></Button>
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
            {item.product.discount>0 ? (
            <TableCell>
              {item.product.discount} zł
            </TableCell>
            ):(
            <TableCell>
              {item.product.price} zł
            </TableCell>
            )}

            
         
            <TableCell>
              <input type="number" min={1} defaultValue={item.quantity}  onChange={(e) => updateQuantity(parseInt(e.target.value), item.product._id.toString())}></input>
            </TableCell>
            <TableCell>
              <span onClick={()=>removeFromCart(item.product._id)}>
                 <FaTrashAlt/>
              </span>
             </TableCell>
            
          </TableRow>
      )
      )}
            
        </TableBody>
      </Table>
        <h1 className="mt-[1rem] text-lg text-primary z-[10] relative">Całkowita cena: {totalPrice} zł</h1>
    </div>
  </div>
</>  
  )}

export default CartProducts