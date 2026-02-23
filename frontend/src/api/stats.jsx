import axiosClient from "./axiosClient"

const stats = {

   //Display stats for graphs 
   displayStats: async(params)=>{
        const url = "http://localhost:3000/stats";
        const response = await axiosClient.get(url, 
        params
        )
        return response;
   },

   //Display stats about users 
   displayUserStats: async(params)=>{
        const url = "http://localhost:3000/stats/users";
        const response = await axiosClient.get(url, {
        params
        })
        return response;
   }

}

export default stats