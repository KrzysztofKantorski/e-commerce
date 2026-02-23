import React, { useEffect } from 'react' // 1. Dodaj import useEffect
import SideBar from "./SideBar"
import { Button, ButtonGroup } from "@heroui/react";
import { useNavigate } from "react-router" 
import Hamburger from './Hamburger';
function Products() {
  const navigate = useNavigate();
    
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