import React from 'react'
import AnimatedBackground from '@/components/AnimatedBackground'
import LoadingData from '@/components/handleData/LoadingData';
import Error from '@/components/handleData/Error';
import {useState, useEffect} from "react"
import {useNavigate} from "react-router"
import TextGlitchAnimation from '@/components/TextGlitchAnimation';
import {Form, Image, Button} from "@heroui/react"
import { FaTrashAlt } from "react-icons/fa";
import cart from '../api/cart';
import handleApiError from '../api/handleApiError';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@heroui/table";
import { FaArrowRight } from "react-icons/fa";
import { useData } from '../Context/UserDataContext';
function CartProducts() {
  const [loading, setLoading] = useState(true);
  const [userCart, setUserCart] = useState([]);
  const [updateCart, setUpdateCart] = useState([]);
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState();
  const {clearErrors, handleError, globalError} = handleApiError();
  const { data } = useData();
  const goToOrder = ()=>{
    clearErrors();
    if (!data || !data.username) {
      alert("Musisz się zalogować, aby dodać produkt do koszyka!");
      navigate('/');
      return; 
    }
    navigate("/Order")
  }

  const removeFromCart = async (id)=>{
  try{  
    clearErrors();
    if (!data || !data.username) {
      alert("Musisz się zalogować, aby dodać produkt do koszyka!");
      navigate('/');
      return; 
    }
    const response = await cart.removeCartProduct(id);
    if(response.status == 200){
      setUpdateCart(id);
      console.log(response.userCart.cart);    
      }
    }
    catch(error){
      handleApiError(error);
      console.log(globalError);
    }
  }
  const updateQuantity = async ( quantity,  id)=>{  
    clearErrors();
    if (!data || !data.username) {
          alert("Musisz się zalogować, aby dodać produkt do koszyka!");
          navigate('/');
          return; 
    }
    try{  
      const response = await cart.updateCart(id, quantity);
      if(response.status == 200){
        setQuantity(quantity)
      }
    }
    catch(error){
      handleApiError(error);
      console.log(globalError);
    }

  }
  useEffect(()=>{   
    setLoading(true)
    setUserCart([])
    const displayCart = async()=>{
      clearErrors();
      try{
        if (!data || !data.username) {
          alert("Musisz się zalogować, aby dodać produkt do koszyka!");
          navigate('/');
          return; 
        }
        const response = await cart.displayCart();
        if(response.status == 200){
          if (response.data.cart) {
            setUserCart(response.data.cart);
          } 
        }
      }
      catch(error){
        handleError(error);
        console.log(globalError);
      }
      finally{
        setLoading(false)
      }
    }
    displayCart();
  }, [quantity, updateCart])

  const totalPrice = userCart.reduce((total, item) => {
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

  if(globalError !=""){
    return <Error error={globalError}></Error>
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
          {userCart.map((item, index)=>(
            
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