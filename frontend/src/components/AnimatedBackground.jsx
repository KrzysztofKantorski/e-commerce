import React from 'react'
import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
function AnimatedBackground({gradientStyle}) {
  return (
     <div className="fixed inset-0 z-[1] ">
        <AnimatedGridPattern
            numSquares={200}
            maxOpacity={0.5}
            duration={1}
            repeatDelay={1}
            className={cn(
            `[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]`,
            "absolute inset-0 w-full h-full text-primary"
            )}
        />
    </div>
  )
}

export default AnimatedBackground