import React from 'react'

function Error({error}) {
  return (
    <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-danger">Error loading product</h2>
                <p className="text-default-500">{error}</p>
    </div>
  )
}

export default Error