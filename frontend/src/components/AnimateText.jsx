import React from 'react'
import { TypingAnimation } from "@/components/magicui/typing-animation";
function AnimateText({text}) {
  return (
    <TypingAnimation startOnView={true}  className="text-primary text-[6rem] text-center" duration={100}>{text}</TypingAnimation>
  )
}

export default AnimateText