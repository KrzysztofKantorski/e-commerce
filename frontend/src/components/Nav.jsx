import React from 'react'
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Link,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
import {useState} from "react"
import DisplaySearch from './DisplaySearch';
import {useNavigate} from "react-router"
import {useData} from "../Context/UserDataContext"
import Cart from "./Cart"
import Favorites from "./Favorites"

function Nav() {
  const { data, logout } = useData(); 
   
  const navigate = useNavigate();
  const goToLogin = ()=>{
    console.log("siup")
    navigate("/Login")
  }
  const handleLogout = ()=>{
    logout();
  }
  const goToRegister = ()=>{
    navigate("/Register")
  }
  const [searchText, setSearchText] = useState("");
  console.log(searchText)
  return (
    <>
    <Navbar isBordered className="flex justify-around w-[100%] z-[1000]">
     
      <NavbarContent justify="start">
        <NavbarContent className="hidden sm:flex z-[1000]">
          <NavbarItem>
            <Link color="foreground" href="#">
              Nowości
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link aria-current="page" color="primary" href="#">
              Customers
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              Integrations
            </Link>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>

      <NavbarContent as="div" justify="center">
        <Input
          classNames={{
          base: "sm:w-[15rem] md:w-[17rem] lg:w-[20rem] xl:w-[25rem] h-10",
          mainWrapper: "h-full w-full",
          input: "text-small",
          inputWrapper:
            "h-full w-full font-normal text-default-500 bg-default-400/20",
              }}
          placeholder="Wyszukaj..."
          size="sm"
         
          type="search"
          value={searchText}
          onChange={(e)=>setSearchText(e.target.value)}
        />
      </NavbarContent>

      <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-center">
         {!data.username ? (
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="primary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
            
          ): (
            <>
            <Cart></Cart>
            <Favorites></Favorites>
             <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name="Jason Hughes"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            </>
          )}
        
       

          <DropdownMenu aria-label="Profile Actions" variant="flat">
         
          {!data.username ? (
            <>
            <DropdownItem key="settings" onPress={()=>goToLogin()}>Login</DropdownItem>
            <DropdownItem key="team_settings" onPress={()=>goToRegister()}>Register</DropdownItem>
            </>
          ): (
            <>
             <DropdownItem key="username">Witaj: {data.username}</DropdownItem>
              <DropdownItem key="email" >{data.email}</DropdownItem>
              <DropdownItem key="logout" onClick = {handleLogout}>Wyloguj się</DropdownItem>
            </>
          )}
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  <DisplaySearch search={searchText}></DisplaySearch>
        
</>
  )
}

export default Nav