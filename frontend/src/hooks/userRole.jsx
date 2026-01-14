import { useNavigate } from 'react-router';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useCategory } from '../Context/CategoyContext';
import {useState, useEffect} from "react"
import {useData} from "../Context/UserDataContext"  
export const useRole = ()=>{
const cookies = new Cookies();
const navigate = useNavigate();
const {data, isAuthReady, setIsAuthReady} = useData();
const [userRole, setUserRole] = useState("");
const [isRoleChecked, setIsRoleChecked] = useState(false);
    const token = cookies.get("TOKEN");
    useEffect(()=>{
        if (!isAuthReady) return;
        const user_role =  ()=>{
        
            try {
              
              if(!token || token === "undefined" || token === "null"){
                alert("Twoja sesja zakończyła się - zaloguj się ponownie");
                navigate("/Login");
                return;
              }
              
              console.log("User role:", data.role);
              setUserRole(data.role);
              if(data.role != "admin"){
                alert("Brak dostępu");
                navigate("/");
                return;
              }

            } catch (error) {
              console.error('Error fetching profile:', error);
            }
            
      }
           user_role();
           setIsAuthReady(true);
           setIsRoleChecked(true);
    },[isAuthReady, data, navigate])

    return { 
        isReady: isAuthReady && isRoleChecked, 
        role: data.role
     };
}