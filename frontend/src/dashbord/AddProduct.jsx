import React from 'react'
import SideBar from "./SideBar"
import {Button, ButtonGroup} from "@heroui/react";
import {useNavigate} from "react-router"
import {useState, useEffect} from "react"
import {Form, Input} from "@heroui/react";
import Cookies from "universal-cookie"
import {Textarea} from "@heroui/input";
import axios from "axios"
const cookies = new Cookies();
function AddProduct() {
    const navigate = useNavigate();
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const [errors, setErrors] = useState({})

    const onSubmit = async(e)=>{
    e.preventDefault();
    setErrors({});
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const newErrors = {};
    let checkLetters = /[a-zA-Z]/g;
    //validation
    if (data.productName.length < 3) {
      newErrors.productName = "Podaj odpowiednią nazwę produktu";
    } 
    if (data.description.length < 5) {
      newErrors.description = "Podaj dokładniejszy opis produktu";
    } 

    if(data.price == ""){
      newErrors.price= "podaj cenę produktu";
    }
    else if(checkLetters.test(data.price)){
        newErrors.price= "podej cenę produktu w odowiednim formacie";
    }
   
     if(data.stock == ""){
      newErrors.price= "podaj ilość produktu";
    }
    else if(checkLetters.test(data.stock)){
        newErrors.stock= "podej ilość produktu w odowiednim formacie";
    }
    if(data.category.length < 3){
      newErrors.category ="podaj odpowienią nazwę kategorii";
    }

   if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return; 
  }
  try{
     const token = cookies.get("TOKEN");
    if (!token) {
      alert("Twoja sesja zakończyła się - zaloguj się ponownie");
      navigate("/Login");
      return;
    }
    const url = "http://localhost:3000/products";
    const response = await axios.post(url, {
          name: data.productName, 
          description: data.description,
          price: data.price,
          stock: data.stock,
          category: data.category
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
    console.log(response.data);
  }
  catch(error){
    console.log(error.message)
  }
}
const reset = ()=>{
    setProductName("");
    setStock("");
    setPrice("");
    setCategory("");
    setDescription("");
  }

  return (
    <div className="flex w-full min-h-[100vh] gap-5">
        <SideBar></SideBar>
        <div className="flex flex-col items-center justify-start w-full gap-5 mt-[2rem]">
            <h1 className="text-lg">Zarządzanie produktami</h1>
            <ButtonGroup>
                <Button onPress={()=>{navigate("/AddProduct")}}>Dodaj</Button>
                <Button onPress={()=>{navigate("/UpdateProduct")}}>Zmień</Button>
                <Button onPress={()=>{navigate("/DeleteProduct")}}>Usuń</Button>
            </ButtonGroup>
            
            <div className=" flex w-full items-center flex-col mt-[2rem] gap-5">  
                <h1 className="text-xl">Dodaj produkt</h1>

                 <Form className="w-full max-w-xs z-[10] relative flex flex-col items-center" onSubmit={onSubmit}  validationErrors={errors}>
                <Input
                    isRequired
                    key="dlsfgkjhhfdjklsog"
                    label="Nazwa produktu"
                    labelPlacement="outside"
                    name="productName"
                    placeholder="Nazwa produktu"
                    value={productName}
                    onChange={(e)=> setProductName(e.target.value)}
                />
                    <Textarea
                    isRequired
                     key="dlsfgk"
                    disableAnimation
                    disableAutosize
                    classNames={{
                        base: "max-w-xs",
                        input: "resize-y min-h-[40px]",
                    }}
                    label="Opis"
                    labelPlacement="outside"
                    name="description"
                    placeholder="Opis"
                    value={description}
                    onChange={(e)=> setDescription(e.target.value)}
                />
                    <Input
                    isRequired
                     key="d"
                    label="Cena"
                    labelPlacement="outside"
                    name="price"
                    placeholder="Cena"
                    value={price}
                    onChange={(e)=> setPrice(e.target.value)}
                />
                    <Input
                    isRequired
                 key="dlsfgkjhhfdjkls"
                    label="Ilość"
                    labelPlacement="outside"
                    name="stock"
                    placeholder="Ilość"
                    value={stock}
                    onChange={(e)=> setStock(e.target.value)}
                />
                    <Input
                    isRequired
                     key="dl"
                    label="Kategoria"
                    labelPlacement="outside"
                    name="category"
                    placeholder="Kategoria"
                    value={category}
                    onChange={(e)=> setCategory(e.target.value)}
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
                 <div>Aby dodać zdjęcie dodaj je do folderu productImages - zapisz je jako nazwa produktu i wykonaj skrypt updateProductImages</div>
            </div>
        </div>
    </div>
  )
}

export default AddProduct