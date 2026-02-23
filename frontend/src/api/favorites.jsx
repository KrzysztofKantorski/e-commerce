import axiosClient from "./axiosClient"

const favorites = {
   //add product to favorites based on id
   addToFavorites: async(id)=>{
        let url = `/favorites/${id}`;
        const response = await axiosClient.post(url,{id});
        return response;
   },

   //remove product from favorites based on id
   removeFavoriteProduct: async(id)=>{
        const url = `http://localhost:3000/favorites/remove/${id}`;
        const response = await axiosClient.delete(url);
        return response;
   },

   //display favorite products
   displayFavoriteProducts: async()=>{
        const url = "http://localhost:3000/favorites";
        const response = await axiosClient.get(url);
        return response;
   }


}

export default favorites