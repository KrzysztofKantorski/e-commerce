import { useNavigate } from 'react-router';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useCategory } from '../Context/CategoyContext';
import {useState} from "react"

export const useCart = ()=>{
const {addToCart, setAddToCart} = useCategory();
const cookies = new Cookies();
const [updateCart, setUpdateCart] = useState([]);
const navigate = useNavigate();
    
const handleAddToCart = async(product)=>{
    const quantity = 1;
    try{
        const token = cookies.get("TOKEN");

        if (!token) {
        alert("Musisz być zalogowany, aby dodawać do ulubionych");
        return;
        }

        console.log(token)
        const url = `http://localhost:3000/cart`;
        const response = await axios.post(url,{
        productId: product, quantity :quantity
        }
        ,  {
        headers: {
        Authorization: `Bearer ${token}`,
          }
        });
        if(response.status == 201){
          
         alert("Produkt został dodany do koszyka");
         setAddToCart({product})
        }
      }
      catch(error){
        console.log("err", error.message)
      
      if (error.response?.status === 400) {
        alert("Produkt został już dodany do ulubionych");
        navigate("/");
      } 
      else if (error.response?.status === 403) {
        alert("Brak uprawnień do wykonania tej operacji");
        
      } 
      else {
        alert("Wystąpił błąd podczas dodawania do ulubionych");
      } 
      }
      
    }


    const removeFromCart = async (id)=>{
        try{
            const token = cookies.get("TOKEN");
            if (!token) {
            alert("Musisz być zalogowany, aby dodawać do ulubionych");
            
            return;
            }
            const url = `http://localhost:3000/cart/${id}`;
            const response = await axios.delete(url, {
            headers: {
            Authorization: `Bearer ${token}`,
            }
        });
            if(response.status == 200){
                setUpdateCart(id);
            }
        }
        
        catch(error){
            setError(error.message)
        }
    }
    return { handleAddToCart, removeFromCart, updateCart, addToCart };
}