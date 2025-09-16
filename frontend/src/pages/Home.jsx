import React from 'react'
import Navbar from "../components/Nav"
import ProductCard from "../components/ProductCard";
import Hero from "../components/Hero"
import Footer from '@/components/Footer';

function Home() {
  
  return (
    <>
    
    <Navbar></Navbar>
    <Hero></Hero>
    <ProductCard></ProductCard>
    <Footer></Footer>
    </>
    
  )
}

export default Home