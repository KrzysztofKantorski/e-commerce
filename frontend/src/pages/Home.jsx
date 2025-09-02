import React from 'react'
import Navbar from "../components/Nav"
import ProductCard from "../components/ProductCard"
import Hero from "../components/Hero"
import { CategoryProvider } from '../Context/CategoyContext'


function Home() {
  
  return (
    <>
    <Navbar></Navbar>
    <Hero></Hero>
    <CategoryProvider>
        <ProductCard></ProductCard>
    </CategoryProvider>
    </>
    
  )
}

export default Home