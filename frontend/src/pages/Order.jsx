import React, { useEffect } from 'react'
import Error from '@/components/handleData/Error'
import {useState} from "react"
import {useNavigate} from "react-router"
import order from '../api/order'; 
import TextGlitchAnimation from '@/components/TextGlitchAnimation'
import {Form, Input, Button} from "@heroui/react";
import handleApiError from '@/api/handleApiError';
import { useData } from '../Context/UserDataContext';
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
  const { data } = useData();
  const {clearErrors, handleError, globalError} = handleApiError()
  const onSubmit = async (e) => {
    clearErrors();
    if (!data || !data.username) {
      alert("Musisz się zalogować, aby dodać produkt do koszyka!");
      navigate('/');
      return; 
    }
    e.preventDefault();
    setErrors({});
    const fieldData = Object.fromEntries(new FormData(e.currentTarget));
    const newErrors = {};
    let checkNumber = /\d/;
    //validation
    if (!fieldData.fullName.includes(" ")) {
      newErrors.fullName = "Podaj zarówno imię jak i nazwisko";
    } 
    else if (fieldData.fullName.length < 4) {
      newErrors.fullName = "Imię i nazwisko musi mieć co najmniej 4 znaki";
    } 
    else if (checkNumber.test(fieldData.fullName)) {
      newErrors.fullName = "Imię i nazwisko nie może zawierać cyfr";
    }
    
     if(fieldData.street.length < 3){
      newErrors.street= "podaj poprawną nazwę ulicy wraz z numerem";
    }
    
    if (fieldData.street.length < 3) {
      newErrors.street = "podaj poprawną nazwę ulicy (min. 3 znaki)";
    }

    if(fieldData.city.length < 3){
      newErrors.city ="podaj poprawną nazwę miasta";
    }

    const postalCodeRegex = /^\d{2}-\d{3}$/;
    if (!postalCodeRegex.test(fieldData.postalCode)) {
      newErrors.postalCode = "Podaj kod pocztowy w formacie 00-000";
    }
  
    if (!fieldData.country || fieldData.country.length < 2) {
      newErrors.country = "Podaj poprawną nazwę kraju";
    }
    let checkPhoneNumber = /^\d{9}$/;
    if(!checkPhoneNumber.test(fieldData.number)){
      newErrors.number = "Podaj numer telefonu w prawidłowym formacie";
    }

     if(fieldData.number.length < 9){
      newErrors.number = "Podaj numer telefonu w prawidłowym formacie";
    }
   if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return; 
  }

  try {
    const response = await order.addUserData(fieldData);
    console.log("Success:", response.data);
    navigate("/OrderSuccess");
  } catch (error) {
    handleError(error);
    console.error("Error:", error.response?.data || error.message);
    setError(error);
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
    return(<Error error={globalError}></Error>)
  }
  return (
    <div>
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