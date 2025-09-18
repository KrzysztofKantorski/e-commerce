import React from 'react'
import "../styles/Hero.css"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import {useNavigate} from "react-router"
import AnimatedBackground from './AnimatedBackground';
import AnimateText from './AnimateText';
function Hero() {
  const navigate = useNavigate();
     const [sliderRef] = useKeenSlider(
    {
      loop: true,
    },
    [
      (slider) => {
        let timeout
        let mouseOver = false
        function clearNextTimeout() {
          clearTimeout(timeout)
        }
        function nextTimeout() {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 10000)
        }
       
          nextTimeout()
       
        slider.on("dragStarted", clearNextTimeout)
        slider.on("animationEnded", nextTimeout)
        slider.on("updated", nextTimeout)
      },
  ]
)

return (
    <>
    <AnimatedBackground gradientStyle={"to_bottom_right"}/>

    <div ref={sliderRef} className="keen-slider h-[100vh] absolute w-full overflow-hidden  top-[-5vh] left-[0] right-[0] bottom-[0]">
      
    <div className="keen-slider__slide number-slide1 relative z-[5] ">
        <AnimateText text={"Nowe produkty"}></AnimateText>
        <div className="absolute top-[0] h-[100vh] w-[100%] overflow-hidden z-[-1]">
        </div>
        <InteractiveHoverButton onClick={()=>{navigate("/Newest")}}>Zobacz więcej</InteractiveHoverButton>
    </div>

        <div className="keen-slider__slide number-slide2 relative z-[5]" >
           <AnimateText text={"Okazje dnia"}></AnimateText>
        <div className="absolute top-[0] h-[100vh] w-[100%] overflow-hidden z-[-1]">
          </div>
          <InteractiveHoverButton onClick={()=>{navigate("/Discounts")}} >Zobacz więcej</InteractiveHoverButton>
        </div>
        <div className="keen-slider__slide number-slide3 relative z-[5]">
           <AnimateText text={"Elektronika"}></AnimateText>
        <div className="absolute top-[0] h-[100vh] w-[100%] overflow-hidden z-[-1]">
          </div>
          <InteractiveHoverButton onClick={()=>{navigate("/Category")}}>Zobacz więcej</InteractiveHoverButton>
          
        </div>
      
      </div>
    </>
  )
}

export default Hero