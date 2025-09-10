import React from 'react'
import {Form, Input, Button} from "@heroui/react";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import { HyperText } from "@/components/magicui/hyper-text";

import {useState, useEffect} from "react"
import AnimatedBackground from '@/components/AnimatedBackground';
import axios from "axios"
import "../styles/Login.css";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function Login(e) {
  
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(true);
   const [errors, setErrors] = useState({});
   const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  
  const loginAuth = async (e)=>{
      e.preventDefault();

  const data = Object.fromEntries(new FormData(e.currentTarget));
  if(!data.username || data.username === ""){
      setErrors({username: "Nazwa użytkownika jest wymagana"});
      return
  }
     try{
     const response = await axios.post("http://localhost:3000/auth/login", {
        username: username,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if(response.length === ""){
        setMessage("Niepoprawny login lub hasło");
       
        setErrors({password: "Niepoprawny login lub hasło"})

      }
      cookies.set("TOKEN", response.data.token, {
        path: "/",
        expires: new Date(Date.now() + 60 * 60 * 1000) 
      });
       setMessage(response.data.message);
      window.location.href = "/verify";
    }
    catch(err){
    console.error("Login error:", err);
      
     
      if (err.response) {
        // Serwer odpowiedział z kodem błędu
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
        // Brak odpowiedzi z serwera
        setError("Brak połączenia z serwerem");
      } else {
        // Inny błąd
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
   
    <AnimatedBackground gradientStyle={"to_bottom_left"}/>


   <div className="w-[100%] min[100vh] flex column items-center justify-center"> 
    
      <div className="flex flex-col items-center justify-start py-[5rem]">
     <HyperText duration={1000} className="relative text-center text-primary-xlg z-[1000]">Zaloguj się</HyperText>
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
        <Button color="primary" type="submit" onPress={()=>{loginAuth()}}className="px-[1rem] px-[1rem]">
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