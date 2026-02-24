import axiosClient from "./axiosClient"

const order = {

    //display user data of order
   displayOrders: async()=>{
    const url = "http://localhost:3000/orders";
    const response = await axiosClient.get(url);
    return response;
   },

   //add user data to order
   addUserData: async(data)=>{
    const url = `http://localhost:3000/orders`;
    const response = await axiosClient.post(url, 
      {
        shippingAddress: {
          fullName: data.fullName, 
          street: data.street,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country,
          phone: data.number
        }
      }
    );
    return response;
   },
   
   //display user data of order
   displayData: async()=>{
    const url = "http://localhost:3000/orders";
    const response = await axiosClient.get(url);
    return response;
   },

   //finalize order with payment
    finalizeOrder: async(payment)=>{
    const url = "http://localhost:3000/orders";
    const response = await axiosClient.put(url, {payment: payment, status: "paid"});
    return response;
   }
   
          
}

export default order