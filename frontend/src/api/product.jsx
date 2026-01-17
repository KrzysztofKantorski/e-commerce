import axiosClient from "./axiosClient"

const product = {

   //Display products with pagination, category and filter
   displayProducts: async(page,category, filter)=>{
        let url = "http://localhost:3000/products";
        const params = { page, limit: 10 };
        
        if (category && category !== "all") {
        url += `/category/${category}`;
        }

        if (filter && filter !== "newest") {
        params.sort = filter;
        }
        
        const response = await axiosClient.get(url, { params });
        
        return response.data;
   },

   //Display single product based in id
   displayProduct: async(id)=>{
      const response = await axiosClient.get(`/products/${id}`);
      return response.data;
   }


}

export default product