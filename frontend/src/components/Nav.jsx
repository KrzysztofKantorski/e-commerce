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
import {
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
} from "@heroui/react";
import {useState, useEffect} from "react"
import DisplaySearch from './DisplaySearch';
import {useNavigate} from "react-router"
import {useData} from "../Context/UserDataContext"
import Cart from "./Cart"
import Favorites from "./Favorites"
import Cookies from "universal-cookie"
import axios from "axios"
const cookies = new Cookies();
function Nav() {
  const { data, logout } = useData(); 
  const [image, setImage] = useState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  if(data){
    
  const fetchUserProfile = async () => {
    try {
       const token = cookies.get("TOKEN");
    
      
      const response = await axios.get(
        'http://localhost:3000/auth/uploadImage',
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      setImage(response.data.image);
     
    } catch (error) {
      console.error('Error fetching profile:', error);
    } 
  };
  
  useEffect(() => {
    fetchUserProfile();
  }, []);
  }
  const goToLogin = ()=>{
    console.log("siup")
    navigate("/Login")
  }
  const handleCustomize = ()=>{
    navigate("/Customize")
  }
  const handleLogout = ()=>{
    logout();
    window.location.reload();
  }
  const goToRegister = ()=>{
    navigate("/Register")
  }
  const handleOrders = ()=>{
    navigate("/ShowOrders")
  }
  const [searchText, setSearchText] = useState("");
  console.log(searchText)
  return (
    <>
    <Navbar isBordered className="flex justify-around w-[100%] z-[1000]" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
     
      <NavbarContent justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="block sm:block md:block  lg:hidden"/>
        <NavbarContent className="hidden lg:flex z-[1000]">
          
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
         <NavbarMenu className="flex flex-col lg:hidden ">
        
          <NavbarMenuItem className="flex flex-col items-center gap-2 text-lg relative z-[10]">
            <Link>
            Nowości
            </Link>

            <Link>
            Nowości
            </Link>

            <Link>
            Nowości
            </Link>
          </NavbarMenuItem>
      
      </NavbarMenu>
   
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
                src={image}
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
              <DropdownItem key="customize" onClick = {handleCustomize}>personalizacja</DropdownItem>
              <DropdownItem key="orders" onClick = {handleOrders}>zamówienia</DropdownItem>
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