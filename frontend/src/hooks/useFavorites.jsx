import { useNavigate } from 'react-router';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useCategory } from '../Context/CategoyContext';
import {useState} from "react"

export const useFavorites = ()=>{
const {newProduct, setNewProduct} = useCategory();
const [removedProduct, setRemovedProduct] = useState("");
const cookies = new Cookies();
const [error, setError] = useState(false);
    const navigate = useNavigate();
     const addToFavorites = async(id)=>{
      try{
        const token = cookies.get("TOKEN");
        if (!token) {
        alert("Musisz być zalogowany, aby dodawać do ulubionych");
        
        return;
      }
        console.log(token)
        const url = `http://localhost:3000/favorites/${id}`;
        const response = await axios.post(url,
          {id},  {
        headers: {
        Authorization: `Bearer ${token}`,
          }
        });
        if(response.status == 201){
          setNewProduct(prev => [...prev, id]);
         return { success: true,
                    message: "Produkt został dodany do ulubionych"
          };
        }
      }
      catch(error){
      return { success: false, 
        message: "Wystąpił błąd podczas dodawania do ulubionych",
        error };
      }
      
    }

     const removeFromFavorites = async (id)=>{
           try{
            const token = cookies.get("TOKEN");
            const url = `http://localhost:3000/favorites/remove/${id}`;
            const response = await axios.delete(url, {
            headers: {
            Authorization: `Bearer ${token}`,
            }
        });

        if(response.status == 200){
            setRemovedProduct(id)
            return { success: true,
                    message: "Produkt został usunięty z ulubionych"
          };
        }
        
        }
        catch(error){
            setError(error.message);
            
            return { success: false,
                    message: `Wystąpił błąd podczas usuwania z ulubionych: ${error.message}`,
                    error
          };
        }
          
    }
    return { addToFavorites, removeFromFavorites, newProduct, removedProduct };
}