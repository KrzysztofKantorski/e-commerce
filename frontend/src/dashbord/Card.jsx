import React from 'react'
import {Listbox, ListboxItem} from "@heroui/react";

function Card({ searchedProducts, onProductSelect }) {
const ListboxWrapper = ({children}) => (
  <div className="w-full max-w-[50%]  border-small  rounded-small border-default-200 dark:border-default-100 ml-[25%]">
    {children}
  </div>
);

return (
    <>
    <ListboxWrapper className={searchedProducts == [] ? "hidden": "block"}>
        <Listbox
        isVirtualized
          className="w-full"
          label="Wyniki wyszukiwania"
          itemClasses={{ base: "px-3 w-full" }}
          virtualization={{ maxListboxHeight: 250, itemHeight: 70 }}
        >
          {searchedProducts.map((product, index) => (
            <ListboxItem key={product._id || index} 
            textValue={product.name} 
            onClick={() => {onProductSelect(product._id)}}
            >
              <div className="mb-4">
                <div className="text-md font-medium truncate">{product.name}</div>
                <div className="text-sm text-default-500">{product.price} zł</div>
              </div>
              <img
                src={`http://localhost:3000${product.images}`}
                className="w-15 h-15 object-cover rounded absolute top-1 right-8"
                alt={product.name}
              />
            </ListboxItem>
          ))}
        </Listbox>
      </ListboxWrapper>


     
    </>
     
  )
}

export default Card