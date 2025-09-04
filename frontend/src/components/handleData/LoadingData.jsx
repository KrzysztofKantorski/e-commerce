import React from 'react'
import { Spinner } from "@heroui/react";
function LoadingData({title}) {
  return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
                <p className="ml-3">{title}</p>
            </div>
  )
}

export default LoadingData