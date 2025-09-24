import React from 'react'
import LoadingData from '@/components/handleData/LoadingData'
import Error from '@/components/handleData/Error'
import axios from "axios"
import {useState} from "react"
import {useNavigate} from "react-router"
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import TextGlitchAnimation from '@/components/TextGlitchAnimation'
import {Form, Input, Button} from "@heroui/react";
import Cookies from "universal-cookie"

const cookies = new Cookies();

function Register() {
  const [errors, setErrors] = useState({})
  const [error, setError] = useState(null)
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState()
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const newErrors = {};
    let testEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let checkLowerLetters = /[a-z]/;
    let checkUpperLetters = /[A-Z]/;
    let checkNumber = /[0-9]/;
    //validation
   
     if (data.username.length < 3) {
      newErrors.username = "Imię i nazwisko musi mieć co najmniej 4 znaki";
    } 
    if(!testEmail.test(data.email)){
      newErrors.email = "Podaj poprawny adres email";
    }
    const checkPassword = []
    if(!checkLowerLetters.test(data.password)){
      checkPassword.push("Hasło musi zawierać co najmniej 1 małą literę");
    }
    if(!checkUpperLetters.test(data.password)){
      checkPassword.push("Hasło musi zawierać co najmniej 1 dużą literę");
    }
    if(!checkNumber.test(data.password)){
      checkPassword.push("Hasło musi zawierać co najmniej 1 cyfę");
    }
     if(data.password.length<8){
      checkPassword.push("Hasło musi zawierać co najmniej 8 znaków");
    }
    if(checkPassword.length !=0){
       newErrors.password = `Hasło musi zawierać: ${checkPassword.join(', ')}`;
    }
   if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return; 
  }

    try{
     const response = await axios.post("http://localhost:3000/auth/register", {
        username: username,
        email: email,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if(response.length === ""){
        setMessage("Wprowadzono niepoprawne dane");
      }
     alert("rejestracja zakończona pomyślnie");
     navigate("/")
       setMessage(response.data.message);
      
    }
    catch(err){
    console.error("Login error:", err);     
      if (err.response) {
        setMessage(err.response.data?.message || "Błąd logowania");
        if(err.response.status == 400){
          alert("Użytkowni z tą nazwą już istnieje")
          window.location.reload();
        }
        if(err.response.status == 500){
          alert("Użytkowni z tą nazwą już istnieje")
          window.location.reload();
        }
      } else if (err.request) {
        
        setError("Brak połączenia z serwerem");
      } else {
       
        setError("Wystąpił błąd podczas logowania");
      }
   }

  }
  const reset = ()=>{
    setUsername("");
    setEmail("");
    setPassword("");
  
  }
  if(error){
    return(<Error></Error>)
  }
  return (
    <div>
      
      <div className="w-full flex flex-col items-center justify-center min-h-[90vh]">
      <TextGlitchAnimation text={"Rejestracja"}></TextGlitchAnimation>
      <NeonGradientCard className="items-center justify-center text-center min-h-[20rem] max-w-sm z-[10] mt-[2rem]">
        <Form className="w-[30rem] max-w-xs flex flex-col gap-5 min-h-[20rem] text-left  justify-center" onSubmit={onSubmit}  validationErrors={errors}>
      <Input
        isRequired
        className="border-2 border-primary rounded-lg"
        label="Nazwa użytkownika"
        labelPlacement="outside"
        name="username"
        placeholder="Nazwa użytkownika"
        value={username}
        onChange={(e)=> setUsername(e.target.value)}
      />
         <Input
        isRequired
        
        label="Email"
        labelPlacement="outside"
        className="border-2 border-primary rounded-lg"
        name="email"
        placeholder="Email"
         value={email}
        onChange={(e)=> setEmail(e.target.value)}
      />
         <Input
        isRequired
        
        label="Hasło"
        labelPlacement="outside"
        name="password"
        placeholder="Hasło"
        className="border-2 border-primary rounded-lg"
        value={password}
        onChange={(e)=> setPassword(e.target.value)}
      />
    
      <div className="flex items-center justify-center gap-2 text-center w-full mt-[1rem]">
          <Button type="submit" variant="bordered" >
        Zatwierdź
      </Button>
       <Button type="reset" variant="bordered" onPress={()=>reset()}>
          Wyczyść
      </Button>
      </div>
    
      
    </Form>
</NeonGradientCard>
      </div>
      
    </div>
   
  )
}

export default Register