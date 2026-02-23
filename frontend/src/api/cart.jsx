import axiosClient from "./axiosClient"

const cart = {
   //remowe product from cart based on id
   removeCartProduct: async(id)=>{
        const url = `http://localhost:3000/cart/${id}`;
        const response = await axiosClient.delete(url);
        return response;
   },

    //add product to cart based on id
    addCartProduct: async(id)=>{
        const url = `http://localhost:3000/cart`;
        const response = await axiosClient.post(url,{
        productId: id, quantity :1
        });
        return response;
   },

   //display products in cart
   displayCart: async()=>{
        const url = "http://localhost:3000/cart";
        const response = await axiosClient.get(url);
        return response;
   },


}

export default cart