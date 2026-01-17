import React, { useEffect } from 'react' // 1. Dodaj import useEffect
import SideBar from "./SideBar"
import { Button, ButtonGroup } from "@heroui/react";
import { useNavigate } from "react-router" 
import Hamburger from './Hamburger';
import Cookies from "universal-cookie"

const cookies = new Cookies();
function Products() {
  const navigate = useNavigate();
  const token = cookies.get("TOKEN");
  useEffect(() => {
    if (!token) {
      navigate("/Login");
    }
  }, [token, navigate]); 
    
  return (

    <div className="flex w-full min-h-[100vh] gap-5">
        <SideBar></SideBar>
        <Hamburger></Hamburger>
        <div className="flex flex-col items-center justify-start w-full gap-5 mt-[2rem]">
            <h1 className="text-lg">Zarządzanie produktami</h1>
            <ButtonGroup>
                <Button onPress={()=>{navigate("/AddProduct")}}>Dodaj</Button>
                <Button onPress={()=>{navigate("/UpdateProduct")}}>Zmień</Button>
                <Button onPress={()=>{navigate("/DeleteProduct")}}>Usuń</Button>
            </ButtonGroup>
            <div>
            </div>
        </div>
    </div>
  )
}

export default Products