import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from "./pages/Home"
import Product from "./pages/Product"
import {HeroUIProvider} from '@heroui/react'
import { BrowserRouter, Routes, Route } from "react-router";


export default function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/product/:id" element={<Product />}></Route>
      </Routes>
    </BrowserRouter>
    
          
    </>
    
  );
}




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeroUIProvider>
  <App></App>
    </HeroUIProvider>
  </StrictMode>,
)
