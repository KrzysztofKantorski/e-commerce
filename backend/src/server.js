const express = require("express");
const connect = require("./config/db.js")
const authRoutes = require("./routes/authRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const path = require('path');
const fs = require('fs');
const cors = require("cors")

const auth = require("./validators/login.js");

require("dotenv").config();
const app = express();
app.use(express.json())


const port = 3000;

app.use(cors())
//connection with database
connect();


app.use('/product-images', express.static('productImages', {
  index: false,           
  extensions: ['jpg', 'png'] // only this extensions
}));

app.use(express.urlencoded({ extended: true }));
//routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/favorites", cartRoutes);



//display user data
app.get("/user", auth, (req, res)=>{
    try{
        const user = req.user;
        return res.json({
        user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      },
      user: user
    })
    }
    catch(error){
    console.error('Profile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
    }
    

})

app.listen(port, ()=>{
    console.log("Success");
})


