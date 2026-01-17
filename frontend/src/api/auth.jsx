import axiosClient from "./axiosClient"
const auth = {

    // User login
    login: async (username, password)=>{
        const response = await axiosClient.post("/auth/login", {
            username: username,
            password: password
        });
        return response.data
    },

    // User logout
    logout: async ()=>{
        await axiosClient.post("/auth/logout");
        return {message: "Logged out successfully"};
    },

    // Check authentication status
    checkAuth: async () => {
        const response = await axiosClient.get("/auth/me");
        return response.data;
    }
}

export default auth