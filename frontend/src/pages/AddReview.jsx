import React from 'react'
import {Form, Input, Button, Textarea} from "@heroui/react";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import { HyperText } from "@/components/magicui/hyper-text";
import {useState, useEffect} from "react"
import "../styles/Login.css";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/react";
import {useNavigate} from "react-router"
import { useParams } from 'react-router';
import reviews from '../api/reviews';
import handleApiError from '../api/handleApiError';
import LoadingData from '../components/handleData/LoadingData';
import Error from '../components/handleData/Error';
import { useData } from '../Context/UserDataContext';
function AddReview(e) {
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const {product} = useParams();
  const {clearErrors, handleError, globalError} = handleApiError()
  const { data } = useData();
  const addReview = async (e) => {
     if (!data || !data.username) {
        alert("Musisz się zalogować, aby dodać produkt do koszyka!");
        navigate('/');
        return; 
      }
      e.preventDefault();
      if (!comment.trim() || !rating) {
        setErrors({
          comment: !comment.trim() ? "Komentarz jest wymagany" : "",
          rating: !rating ? "Ocena jest wymagana" : ""
        });
        return;
      }

   

    try {
      clearErrors();
       
      const numericRating = parseInt(rating);
      const response =  await reviews.addReview(product, comment, numericRating);
      setLoading(true);
      if (response.status === 200) {
        alert("Opinia dodana pomyślnie!");
        navigate(`/product/${product}`);
      }
    } 
    catch (err) {
      handleApiError(err);
      console.log(err);
    } 
    
  };
   const clear = ()=>{
    setMessage("");
    setComment("");
    setRating("")
   }

  if(loading){
    return <LoadingData></LoadingData>
  }
  if(globalError !=""){
    return <Error error={globalError}></Error>
  }
  return (
    <>
   
    
<div className="w-[100%] min[100vh] flex column items-center justify-center"> 
  <div className="flex flex-col items-center justify-center relative">
    <HyperText duration={1000} className="relative text-primary text-center text-[6rem] z-[1000]">Dodaj opinię</HyperText>
         <NeonGradientCard className="items-center justify-center text-center min-h-[20rem] max-w-sm z-[10] mt-[2rem]">
            <Form
            validationErrors={errors}
            className="w-[30rem] max-w-xs flex flex-col gap-5 min-h-[10rem] text-left  justify-center items-center"
            onReset={() => setAction("reset")}
            onSubmit={addReview}>

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
                base: "before:bg-default-200", 
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