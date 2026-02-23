import axiosClient from "./axiosClient"

const reviews = {

   //Display reviews of product based on id
   displayReviews: async(id, page, filter)=>{
        let url = `http://localhost:3000/products/${id}/reviews`;
        const params = { page, limit: 5 };
        if(filter!="newest"){
            url+=`?sort=${filter}`;
        }
        const response = await axiosClient.get(url, {params});
        return response;
   },

}

export default reviews