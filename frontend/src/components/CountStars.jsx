import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const CountStars = ({ rating, size = "1rem", className = "" }) => {
  
  const averageRating = rating;
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.3 && averageRating % 1 <= 0.7;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} color="gold" size={size} />
      ))}
      
      
      {hasHalfStar && (
        <FaStarHalfAlt key="half" color="gold" size={size} />
      )}
      
     
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} color="gray" size={size} />
      ))}
      
      
     
    </div>
  );
};

export default CountStars;