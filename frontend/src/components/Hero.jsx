import React from 'react'
import "../styles/Hero.css"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import Shoes from "../Images/Buty Nike Air Max 270.jpg"

import {
Button
} from "@heroui/react";
function Hero() {
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
      <div ref={sliderRef} className="keen-slider h-[95vh] ">
        <div className="keen-slider__slide number-slide1 relative">
            1

          <div className="absolute bottom-[10rem] left-[2rem]">
              <h1 className="text-white">Nowa dostawa butów</h1>
              <Button>Zobacz więcej</Button>
          </div>
           
        </div>
        <div className="keen-slider__slide number-slide2">2</div>
        <div className="keen-slider__slide number-slide3">3</div>
      
      </div>
    </>
  )
}

export default Hero