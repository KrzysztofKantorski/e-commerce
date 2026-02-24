import axiosClient from "./axiosClient"

const userProfile = {

    //Display user image
    displayPicture: async ()=>{
        const response = await axiosClient.get(
        '/auth/uploadImage',
      );
        return response?.data
    },

    //change user image
   changeImage: async(formData)=>{
      const url = `http://localhost:3000/auth/uploadImage`;
      const response = await axiosClient.post(url, formData);
      return response;
   }
}

export default userProfile