import React from 'react'
import axios from "axios"
import {useState, useEffect} from "react"
import {useNavigate} from "react-router"
import LoadingData from './handleData/LoadingData'
import Error from './handleData/Error'
import {Card, CardBody} from "@heroui/react";
import CountStars from "../components/CountStars";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react";
import { useCategory } from "../Context/CategoyContext";

function DisplayComments({id}) {
    const product = id;
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("newest");
    const navigate = useNavigate();
     // POPRAWIONE: użyj useEffect do ustawiania productId
   
   const AddRewiev = ()=>{
   
    navigate(`/AddReview/${product}`);
   }
    const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
        });
    };
    useEffect(()=>{
    const fetchReviews = async()=>{
        setLoading(true);
        setError(null)
        try{
            let url = `http://localhost:3000/products/${id}/reviews`;
            if(filter!="newest"){
                url+=`?sort=${filter}`
            }
            const response = await axios.get(url);
            console.log(response)
           
            if (response.data.reviews) {
                console.log("✅ Znaleziono response.data.reviews");
                setReviews(response.data.reviews);
            } 
        }
        catch(error){
            console.log(error.message)
                // Obsługa różnych błędów
            if (error.response?.status === 400) {
                alert("Produkt został już dodany do ulubionych");
                navigate("/");
            } 
            else if (error.response?.status === 403) {
                alert("Brak uprawnień do wykonania tej operacji");  
            } 
            else {
                alert("Wystąpił błąd podczas dodawania do ulubionych");
            } 
        }
        finally{
        setLoading(false)
        }
    }
    fetchReviews();
}, [id, filter])

    if(loading){
        return(
            <LoadingData></LoadingData>
        )
    }
    if(error){
        return(
             <Error></Error>
        ) 
    }
return (
<div>
      
   
    <div className="flex gap-2 items-center">
    <Dropdown  classNames={{
        base: "before:bg-default-200", // change arrow background
        content:
          "py-1 px-1 border border-default-200 bg-linear-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
      }}>
      <DropdownTrigger>
        <Button className="shadow-small rounded-medium py-[1.5rem] max-w-[500px] min-w-[150px] text-center  bg-primary text-[rgb(255,255,255)] h-8">Sortuj</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Action event example" onAction={(key) => setFilter(key)}>
        <DropdownItem key="newest">Od najnowszych</DropdownItem>
        <DropdownItem key="ratingAsc">Najniższa ocena</DropdownItem>
        <DropdownItem key="ratingDesc">Najwyższa ocena</DropdownItem>
      </DropdownMenu>
    </Dropdown>
   <Button color="primary" onPress={() => {AddRewiev()}} className="z-100 py-[1.5rem]">
            Dodaj opinię
    </Button>
    </div>
    
        {reviews.map((item, index)=>(
            <>
    <Card className="mt-[1rem] relative py-[.5rem] px-[.5rem] flex flex-col align-center justify-space-between">
      <CardBody>
        <div className="absolute top-[0] right-[.5rem]">{formatDateTime(item.createdAt)}</div>
        <p className="text-[1.5rem] text-primary mb-[1rem]">{item.user?.username}</p>
        <p className="mb-[1rem]">{item.comment}</p>
        <CountStars rating={item.rating} size={22}></CountStars>
      </CardBody>
    </Card>
    </>
    )
    )}
    
</div>
  )
}

export default DisplayComments