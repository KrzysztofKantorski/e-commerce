import React from 'react'
import {Form, Input, Button} from "@heroui/react";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import { HyperText } from "@/components/magicui/hyper-text";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import {useState, useEffect} from "react"
import { cn } from "@/lib/utils";
import axios from "axios"
import "../styles/Login.css";
import Cookies from "universal-cookie";
import AnimatedBackground from '@/components/AnimatedBackground';
import TextGlitchAnimation from '@/components/TextGlitchAnimation';
const cookies = new Cookies();

function Login() {
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
   

   const clear = ()=>{
    setMessage("");
    setPassword("");
    setUsername("");
    setEmail("")
   }

 const registerAuth = async ()=>{}


  return (
    <>
     <AnimatedBackground gradientStyle={"to_bottom_left"}/>

   <div className="w-[100%] min[100vh] flex column items-center justify-center"> 
    
      <div className="flex flex-col items-center justify-center py-[5rem]">
     <HyperText duration={1000} className="relative text-primary text-center text-[6rem] z-[1000]">Zarejestruj się</HyperText>
<NeonGradientCard className="items-center justify-center text-center min-h-[20rem] max-w-sm z-[10] mt-[2rem]">
       <Form
      className="w-[30rem] max-w-xs flex flex-col gap-5 min-h-[20rem] text-left  justify-center"
      onReset={() => clear()}
      onSubmit={(e) => {
        e.preventDefault();
       
      }}
    >
    
   
      <Input
        isRequired
        errorMessage="niepoprawna nazwa użytkownika"
        label="Nazwa użytkownika"
        labelPlacement="outside"
       
        placeholder="Nazwa użytkownika"
        type="text"
        className="border-2 border-primary rounded-lg"
        value={username}
        onChange = {(e)=> setUsername(e.target.value)}
      />
     
       <Input
        isRequired
        errorMessage="niepoprawny adres email"
        label="Email"
        labelPlacement="outside"
        
        placeholder="email"
        type="email"
        className="border-2 border-primary rounded-lg"
        value={email}
        onChange = {(e)=> setEmail(e.target.value)}
      />


       <Input
        isRequired
        errorMessage="niepoprawne hasło"
        label="Hasło"
        labelPlacement="outside"
        
        placeholder="hasło"
        type="password"
        className="border-2 border-primary rounded-lg"
        value={password}
        onChange = {(e)=> setPassword(e.target.value)}
      />
    
    
     
      <div className="flex items-center justify-center gap-2 text-center w-full mt-[1rem]">
        <Button color="primary" type="submit" onPress={()=>{registerAuth()}}className="px-[1rem] px-[1rem]">
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