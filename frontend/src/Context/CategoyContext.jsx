import React, { createContext, useState, useContext } from 'react';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  //default category
  const [category, setCategory] = useState('all'); 
  const [filter, setFilter] = useState("newest");
  const [newProduct, setNewProduct] = useState([]);
  const [addToCart, setAddToCart] = useState([]);
  return (
    <CategoryContext.Provider value={{ category, setCategory, filter, setFilter, newProduct, setNewProduct, addToCart, setAddToCart }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
};

export default CategoryContext;