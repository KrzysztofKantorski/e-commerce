import React from 'react'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@heroui/react";
import {useState} from "react"
import {useNavigate} from "react-router"
function Hamburger() {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const navigate = useNavigate();
  return (
      <Navbar isBordered className="flex justify-around w-[100%] z-[1000] fixed t-[0] l-[0] xl:hidden" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="block sm:block md:block  xl:hidden"/>
           <NavbarMenu className="flex flex-col xl:hidden ">
              <NavbarMenuItem className="flex flex-col items-center gap-2 text-lg relative z-[10]">
                <Link onClick={()=>{navigate("/DashbordHome")}}>
                Strona główna
                </Link>
    
                <Link onClick={()=>{navigate("/Products")}}>
                Zarządzaj produktami
                </Link>
    
                <Link>
                Dodaj promocję
                </Link>

                <Link onClick={()=>{navigate("/UsersChart")}}>
                Użytkownicy
                </Link>
              </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>
     
  )
}

export default Hamburger