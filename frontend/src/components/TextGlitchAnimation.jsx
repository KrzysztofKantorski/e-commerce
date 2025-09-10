import React from 'react'
import { cn } from "@/lib/utils";
import { HyperText } from "@/components/magicui/hyper-text";
function TextGlitchAnimation({text}) {
  return (
    <HyperText duration={1000} className="relative text-primary text-center text-[6rem] z-[1000]">{text}</HyperText>
  )
}

export default TextGlitchAnimation