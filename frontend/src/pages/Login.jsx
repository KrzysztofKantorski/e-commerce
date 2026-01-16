import React from 'react'
import {Form, Input, Button} from "@heroui/react";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import {useState} from "react"
import axios from "axios"
import "../styles/Login.css";
import TextGlitchAnimation from '@/components/TextGlitchAnimation';
import {useData} from "../Context/UserDataContext"
import { useNavigate } from "react-router";
function Login() {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(true);
   const [errors, setErrors] = useState({});
   const [error, setError] = useState(false);
   const [message, setMessage] = useState("");
   const [action, setAction] = useState("")
   const { checkAuth } = useData();
  const navigate = useNavigate();
  const loginAuth = async (e)=>{
  e.preventDefault();

  if(!username || username === ""){
      setErrors({username: "Nazwa użytkownika jest wymagana"});
      return
  }
     try{
      
     const response = await axios.post("http://localhost:3000/auth/login", {
        username: username,
        password: password
      })

      const success = await checkAuth();
      if (success) {
             setMessage("Zalogowano pomyślnie");
             navigate("/"); 
          } else {
             setMessage("Nie udało się pobrać danych profilu.");
          }
      if(response.length === ""){
        setMessage("Niepoprawny login lub hasło");
       
        setErrors({password: "Niepoprawny login lub hasło"})

      }
      setMessage(response.data.message);
    }
    catch(err){
      alert("Login error:", err);
    console.error("Login error:", err);
      
     
      if (err.response) {
      
        switch (err.response.status) {
          case 400:
            setError("Nieprawidłowe hasło lub brak danych");
            setErrors({password: "Niepoprawne hasło"})
            break;
          case 404:
            setError("Użytkownik nie istnieje");
             setErrors({username: "Niepoprawna nazwa użytkownika"})
            break;
          case 500:
            setError("Błąd serwera. Spróbuj ponownie później");
             setErrors({username:"Błąd serwera. Spróbuj ponownie później" ,password: "Błąd serwera. Spróbuj ponownie później"})
            break;
          default:
            setError("Wystąpił nieoczekiwany błąd");
            setErrors({username:"Błąd serwera. Spróbuj ponownie później", password: "Wystąpił nieoczekiwany błąd"})
        }
        setMessage(err.response.data?.message || "Błąd logowania");
      } else if (err.request) {
        
        setError("Brak połączenia z serwerem");
      } else {
       
        setError("Wystąpił błąd podczas logowania");
      }
   }

  
   }

   const clear = ()=>{
    setMessage("");
    setPassword("");
    setUsername("")
   }

 

  return (
    <>
   
   
    <TextGlitchAnimation text={"Zaloguj się"}></TextGlitchAnimation>

   <div className="w-[100%] min[100vh] flex column items-center justify-center"> 
    
      <div className="flex flex-col items-center justify-start py-[5rem]">
     
<NeonGradientCard className="items-center justify-center text-center min-h-[20rem] max-w-sm z-[10] mt-[2rem]">
       <Form
       validationErrors={errors}
      className="w-[30rem] max-w-xs flex flex-col gap-5 min-h-[20rem] text-left  justify-center"
      onReset={() => setAction("reset")}
       
      onSubmit={loginAuth}
    >
    
   
      <Input
        isRequired
        label="Nazwa użytkownika"
        labelPlacement="outside"
        placeholder="Nazwa użytkownika"
        name="username"
        type="text"
        className="border-2 border-primary rounded-lg"
        value={username}
        onChange = {(e)=> setUsername(e.target.value)}    
      />
     
     
       <Input
        isRequired
        label="Hasło"
        labelPlacement="outside"
        name="password"
        placeholder="hasło"
        type="password"
        className="border-2 border-primary rounded-lg"
        value={password}
        onChange = {(e)=> setPassword(e.target.value)}
      />
    
    
     
      <div className="flex items-center justify-center gap-2 text-center w-full mt-[1rem]">
        <Button color="primary" type="submit" className="px-[1rem] px-[1rem]">
          Zaloguj
        </Button>
        <Button type="reset" variant="flat" className="px-[1rem] px-[1rem]" onPress={()=>{clear()}}>
          Wyczyść
        </Button>
        
      </div>
    </Form>
    </NeonGradientCard>
    </div>
     
   </div>
     </>
  )
}

export default Login