import axiosClient from "./axiosClient"

const userProfile = {

    //Display user image
    displayPicture: async ()=>{
        const response = await axiosClient.get(
        '/auth/uploadImage',
      );
        return response?.data
    },
   
}

export default userProfile