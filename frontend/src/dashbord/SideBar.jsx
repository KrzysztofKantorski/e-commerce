import React from 'react'
import {Listbox, ListboxItem} from "@heroui/react";
import {useNavigate} from "react-router"
import {useState, useEffect} from "react"
function SideBar() {
  const navigate = useNavigate();

 const ListboxWrapper = ({children}) => (
  <div className="fixed w-full max-w-[200px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100 min-h-[100vh] ">
    {children}
  </div>
);
  return (
    <div>
    <ListboxWrapper>
      <Listbox aria-label="Actions">
        <ListboxItem key="home" onClick={()=>{navigate("/DashbordHome")}}>Strona główna</ListboxItem>
        <ListboxItem key="products" onClick={()=>{navigate("/Products")}}>Zarządzaj produktami</ListboxItem>
        <ListboxItem key="discount">Dodaj promocję</ListboxItem>
        <ListboxItem key="users" onClick={()=>{navigate("/UsersChart")}}>Użytkownicy</ListboxItem>
        <ListboxItem key="payment">Płatności</ListboxItem>
      </Listbox>
    </ListboxWrapper>
    </div>
  )
}

export default SideBar