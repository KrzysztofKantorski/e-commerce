import React from 'react'
import axios from "axios"
import {useState, useEffect} from "react"
import {useNavigate} from "react-router"
import LoadingData from './handleData/LoadingData'
import Error from './handleData/Error'
import {Card, CardBody} from "@heroui/react";
import CountStars from "../components/CountStars";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react";
import {Pagination} from "@heroui/react";
import TextGlitchAnimation from './TextGlitchAnimation'
import reviews from '../api/reviews';
import handleApiError from '../api/handleApiError';
import { useData } from '../Context/UserDataContext';
function DisplayComments({id}) {
    const product = id;
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState();
    const [review, setReview] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("newest");
    const navigate = useNavigate();
    const {clearErrors, handleError, globalError} = handleApiError()
    const { data } = useData();
    const AddRewiev = ()=>{
      try{
        clearErrors();
        if (!data || !data.username) {
            alert("Musisz się zalogować, aby dodać produkt do koszyka!");
            navigate('/');
            return; 
        }
        navigate(`/AddReview/${product}`);
      }
      catch(error){
        handleError(error);
        console.log(globalError);
      }
      
    }

    const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
        })
    }
    
    const fetchReviews = async(page=1)=>{
        setLoading(true);
        setError(null)
        try{
            clearErrors();
            const response = await reviews.displayReviews(id, page, filter);
            if (response.data.reviews) {
                setReview(response.data.reviews);
                setPages(response.data.totalPages)
            } 
        }
        catch(error){
           handleError(error);
           console.log(globalError);
        }
        finally{
        setLoading(false)
        }
    }

useEffect(()=>{
    setCurrentPage(1);
    fetchReviews(1);
}, [id, filter])

const handlePageChange = (clickedPage)=>{
    setCurrentPage(clickedPage);
    fetchReviews(clickedPage)
}
if(loading){
    return(
        <LoadingData></LoadingData>
    )
}
if(error){
    return(
       <Error error={globalError}></Error>
    ) 
}
return (
<div className="min-h-[50vh]">
      {review.length == 0 ? (
        <>
       <TextGlitchAnimation text={"Brak opinii"}></TextGlitchAnimation>
       <div className="text-center">
         <Button color="primary" onPress={() => {AddRewiev()}} className="z-100 py-[1.5rem]">
            Dodaj opinię
          </Button>
       </div>
        </>
      ) : (
        <>
    <TextGlitchAnimation text={"opinie"}></TextGlitchAnimation>
        <div className="text-center">
    <Dropdown  classNames={{
        base: "before:bg-default-200", 
        content:
          "py-1 px-1 border  border-default-200 bg-linear-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
      }}>
    
      <DropdownTrigger>
        <Button className="shadow-small rounded-medium py-[1.5rem] px-[1rem] text-center mr-[1rem] bg-primary text-[rgb(255,255,255)] h-8">Sortuj</Button>
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
    <div className="min-h-[50vh]">
        {review.map((item, index)=>(
            <>
    <Card className="z-[10] mt-[1rem] relative py-[.5rem] px-[.5rem] flex flex-col align-center justify-space-between">
      <CardBody>
        <div className="absolute top-[0] right-[.5rem]">{formatDateTime(item.createdAt)}</div>
        <p className="text-[1.5rem] text-primary mb-[1rem]">{item.user?.username}</p>
        <p className="mb-[1rem]">{item.comment}</p>
        <CountStars rating={item.rating} size={22}></CountStars>
      </CardBody>
    </Card>
    </>
    ))}
    </div>
        <div className="flex w-full justify-center">
        <Pagination  
        initialPage={currentPage} 
        showControls  
        total={pages} 
        className=" mt-[1rem] relative bottom-[0] z-[10] " 
        onChange={handlePageChange}
        />
   </div>
   </>
    )}
</div>
  )
}

export default DisplayComments