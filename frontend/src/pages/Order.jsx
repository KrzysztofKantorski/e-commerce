import React from 'react'
import LoadingData from '@/components/handleData/LoadingData'
import Error from '@/components/handleData/Error'
import axios from "axios"
import {useState} from "react"
import {useNavigate} from "react-router"
import AnimatedBackground from '@/components/AnimatedBackground'
import TextGlitchAnimation from '@/components/TextGlitchAnimation'
import {Form, Input, Button} from "@heroui/react";
import Cookies from "universal-cookie"

const cookies = new Cookies();

function Order() {
  const [errors, setErrors] = useState({})
  const [error, setError] = useState(null)
  const [fullName, setFullName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [number, setNumber] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const newErrors = {};
    let checkNumber = /\d/;
    //validation
    if (!data.fullName.includes(" ")) {
      newErrors.fullName = "Podaj zarówno imię jak i nazwisko";
    } 
    else if (data.fullName.length < 4) {
      newErrors.fullName = "Imię i nazwisko musi mieć co najmniej 4 znaki";
    } 
    else if (checkNumber.test(data.fullName)) {
      newErrors.fullName = "Imię i nazwisko nie może zawierać cyfr";
    }
    
     if(data.street.length < 3){
      newErrors.street= "podaj poprawną nazwę ulicy wraz z numerem";
    }
    
    if (data.street.length < 3) {
      newErrors.street = "podaj poprawną nazwę ulicy (min. 3 znaki)";
    }

    if(data.city.length < 3){
      newErrors.city ="podaj poprawną nazwę miasta";
    }

    const postalCodeRegex = /^\d{2}-\d{3}$/;
    if (!postalCodeRegex.test(data.postalCode)) {
      newErrors.postalCode = "Podaj kod pocztowy w formacie 00-000";
    }
  
    if (!data.country || data.country.length < 2) {
      newErrors.country = "Podaj poprawną nazwę kraju";
    }
    let checkPhoneNumber = /^\d{9}$/;
    if(!checkPhoneNumber.test(data.number)){
      newErrors.number = "Podaj numer telefonu w prawidłowym formacie";
    }

     if(data.number.length < 9){
      newErrors.number = "Podaj numer telefonu w prawidłowym formacie";
    }
   if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return; 
  }

  try {


    
    const token = cookies.get("TOKEN");
    if (!token) {
      alert("Musisz być zalogowany aby złożyć zamówienie");
      navigate("/Login");
      return;
    }
    
    const url = `http://localhost:3000/orders`;
    
    
    const response = await axios.post(url, 
      {
        shippingAddress: {
          fullName: data.fullName, 
          street: data.street,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country,
          phone: data.number
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    
    console.log("Success:", response.data);
   
    navigate("/OrderSuccess");
    
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    setError(error);
    
    if (error.response?.status === 401) {
      alert("Sesja wygasła. Zaloguj się ponownie.");
      navigate("/Login");
    }
  }
   
  }
  const reset = ()=>{
    setFullName("");
    setStreet("");
    setCity("");
    setCountry("");
    setPostalCode("");
    setNumber("");
  }
  if(error){
    return(<Error></Error>)
  }
  return (
    <div>
      <AnimatedBackground></AnimatedBackground>
      <div className="w-full flex flex-col items-center justify-center min-h-[90vh]">
      <TextGlitchAnimation text={"Dane do zamówienia"}></TextGlitchAnimation>
      
        <Form className="w-full max-w-xs z-[10] relative flex flex-col items-center" onSubmit={onSubmit}  validationErrors={errors}>
      <Input
        isRequired
        
        label="Imię i nazwisko"
        labelPlacement="outside"
        name="fullName"
        placeholder="Imię i nazwisko"
        value={fullName}
        onChange={(e)=> setFullName(e.target.value)}
      />
         <Input
        isRequired
        
        label="Ulica"
        labelPlacement="outside"
        name="street"
        placeholder="Ulica"
         value={street}
        onChange={(e)=> setStreet(e.target.value)}
      />
         <Input
        isRequired
        
        label="Miasto"
        labelPlacement="outside"
        name="city"
        placeholder="Miasto"
        value={city}
        onChange={(e)=> setCity(e.target.value)}
      />
         <Input
        isRequired
       
        label="Kod pocztowy"
        labelPlacement="outside"
        name="postalCode"
        placeholder="Kod pocztowy"
         value={postalCode}
        onChange={(e)=> setPostalCode(e.target.value)}
      />
        <Input
        isRequired
        
        label="Kraj"
        labelPlacement="outside"
        name="country"
        placeholder="Kraj"
         value={country}
        onChange={(e)=> setCountry(e.target.value)}
      />
      
     
        <Input
        isRequired
        
        label="Numer telefonu"
        labelPlacement="outside"
        name="number"
        placeholder="Numer telefonu"
        value={number}
        onChange={(e)=> setNumber(e.target.value)}
      />
    
      <div className="flex gap-2 mt-[1rem]">
          <Button type="submit" variant="bordered" >
        Zatwierdź
      </Button>
       <Button type="reset" variant="bordered" onPress={()=>reset()}>
          Wyczyść
      </Button>
      </div>
    
      
    </Form>

      </div>
      


    </div>
   
  )
}

export default Order