import React from 'react'
import { cn } from "@/lib/utils";
import { HyperText } from "@/components/magicui/hyper-text";
function TextGlitchAnimation({text}) {
  return (
    <HyperText duration={1000} className="relative text-primary text-center text-[3rem] z-[1000] md:text-[4rem] xl:text-[6rem]">{text}</HyperText>
  )
}
export default TextGlitchAnimation