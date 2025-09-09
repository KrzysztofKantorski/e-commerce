import React from 'react'
import {Form, Input, Button, Textarea} from "@heroui/react";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import { HyperText } from "@/components/magicui/hyper-text";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import {useState, useEffect} from "react"
import { cn } from "@/lib/utils";
import axios from "axios"
import "../styles/Login.css";
import Cookies from "universal-cookie";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/react";
import {useNavigate} from "react-router"
import { useParams } from 'react-router';
const cookies = new Cookies();

function AddReview(e) {
  const navigate = useNavigate();
   const [comment, setComment] = useState("");
   const [rating, setRating] = useState("");
   const [loading, setLoading] = useState(true);
   const [errors, setErrors] = useState({});
   const [error, setError] = useState(false);
   const {product} = useParams();

  const [serverError, setServerError] = useState("");
console.log(product)
 const addReview = async (e) => {
    e.preventDefault();

    // Walidacja
    if (!comment.trim() || !rating) {
      setErrors({
        comment: !comment.trim() ? "Komentarz jest wymagany" : "",
        rating: !rating ? "Ocena jest wymagana" : ""
      });
      return;
    }

    setLoading(true);
    setErrors({});
    setServerError("");

    try {
      const token = cookies.get("TOKEN");
      if (!token) {
        alert("Zaloguj się aby dodać opinię");
        navigate("/Login");
        return;
      }

      // Konwersja rating na number
      const numericRating = parseInt(rating);
      
      const response = await axios.post(
        `http://localhost:3000/products/${product}/reviews`, 
        {
          comment: comment.trim(),
          rating: numericRating
        }, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log("Odpowiedź z serwera:", response.data);
      
      if (response.status === 200) {
        alert("Opinia dodana pomyślnie!");
        navigate(`/product/${product}`);
      }

    } catch (err) {
      console.error("Błąd dodawania opinii:", err);
      
      if (err.response?.status === 401) {
        setServerError("Nie jesteś zalogowany");
        navigate("/Login");
      } else if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError("Wystąpił błąd podczas dodawania opinii");
      }
    } finally {
      setLoading(false);
    }
  };
   const clear = ()=>{
    setMessage("");
    setComment("");
    setRating("")
   }

 

  return (
    <>
   
     <div className="fixed flex h-[100vh] t-[0] bottom-[0] left-[0] right-[0] w-[100%] items-center justify-center overflow-hidden rounded-lg border bg-background p-20 z-[1]">
     <AnimatedGridPattern
        numSquares={120}
        maxOpacity={1}
        duration={2}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 text-primary",
        )}>

      </AnimatedGridPattern>
     </div>


   <div className="w-[100%] min[100vh] flex column items-center justify-center"> 
    
      <div className="flex flex-col items-center justify-center relative">
     <HyperText duration={1000} className="relative text-primary text-center text-[6rem] z-[1000]">Dodaj opinię</HyperText>
<NeonGradientCard className="items-center justify-center text-center min-h-[20rem] max-w-sm z-[10] mt-[2rem]">
       <Form
       validationErrors={errors}
      className="w-[30rem] max-w-xs flex flex-col gap-5 min-h-[10rem] text-left  justify-center items-center"
      onReset={() => setAction("reset")}
       
      onSubmit={addReview}
    >
      <Textarea
        disableAnimation
        disableAutosize
        classNames={{
          base: "max-w-xs border-2 border-primary rounded-lg",
          input: "resize-y min-h-[10rem] ",
        }}
        placeholder="Treść opinii"
        value={comment}
       onChange = {(e)=> setComment(e.target.value)}
      />
     <Dropdown  classNames={{
        base: "before:bg-default-200", // change arrow background
        content:
          "py-1 px-1 border border-default-200 bg-linear-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
      }}>
      <DropdownTrigger>
        <Button className="shadow-small rounded-medium py-[1.5rem] max-w-[500px] w-full text-center  bg-primary text-[rgb(255,255,255)] h-8">Wybierz ilość gwiazdek</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Action event example" onAction={(key) => setRating(key)}>
        <DropdownItem key="1">
          <div className="flex text-[1.2rem]">
            <span><FaStar color="gold"/></span>
            <span><FaRegStar color="gold"/></span>
            <span><FaRegStar color="gold"/></span>
            <span><FaRegStar color="gold"/></span>
            <span><FaRegStar color="gold"/></span>
          </div>
          
        </DropdownItem>
        <DropdownItem key="2">
          <div className="flex text-[1.2rem]">
            <span><FaStar color="gold"/></span>
            <span><FaStar color="gold"/></span>
            <span><FaRegStar color="gold"/></span>
            <span><FaRegStar color="gold"/></span>
            <span><FaRegStar color="gold"/></span>
          </div>
          
        </DropdownItem>
        <DropdownItem key="3">
          <div className="flex text-[1.2rem]">
            <span><FaStar color="gold"/></span>
            <span><FaStar color="gold"/></span>
            <span><FaStar color="gold"/></span>
            <span><FaRegStar color="gold"/></span>
            <span><FaRegStar color="gold"/></span>
          </div>
          
        </DropdownItem>
        <DropdownItem key="4">
          <div className="flex text-[1.2rem]">
            <span><FaStar color="gold"/></span>
            <span><FaStar color="gold"/></span>
            <span><FaStar color="gold"/></span>
            <span><FaStar color="gold"/></span>
            <span><FaRegStar color="gold"/></span>
          </div>
          
        </DropdownItem>
         <DropdownItem key="5">
          <div className="flex text-[1.2rem]">
            <span><FaStar color="gold"/></span>
            <span><FaStar color="gold"/></span>
            <span><FaStar color="gold"/></span>
            <span><FaStar color="gold"/></span>
            <span><FaStar color="gold"/></span>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
     
      <div className="flex items-center justify-center gap-2 text-center w-full mt-[1rem]">
        <Button color="primary" type="submit" className="px-[1rem] px-[1rem]">
          Dodaj opinię
        </Button>
        <Button type="reset" variant="flat" className="px-[1rem] px-[1rem]" onPress={()=>{clear()}}>
          Wyczyść
        </Button>
        
      </div>
    </Form>
    </NeonGradientCard>
    </div>
     
   </div>
     </>
  )
}

export default AddReview