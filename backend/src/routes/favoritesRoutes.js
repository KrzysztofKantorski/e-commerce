const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Product = require("../models/product");
const auth = require("../validators/login");

//add product to favorites

router.post("/:productId", auth, async(req, res)=>{
    try{
        const user = req.user.id;
        const {productId} = req.params;
        const userToFind = await User.findById(user);
        if(!userToFind){
        res.status(400).json({
        message: "User was not found"
        })
        }
        const productToFind = await Product.findById(productId);
        if(!productToFind){
            res.status(404).json({
            message: "Product was not found"
        })
         }
        //check if product is alerdy in favorites
        const searchProduct = await userToFind.favorites.find((item) => item._id.toString() === productId);
        if(searchProduct){
        
        res.status(400).json({
        message: "Product is alerdy added to favorites"
        })
           
        }
       
            await userToFind.favorites.push(productToFind)
            await userToFind.save();
             res.status(201).json({
            message: "Product added to favorites"
        })
        
        }
    
    catch(error){
        res.status(500).json({
            message: "An error occured",
            error: error.message
        })
    }
})





//disaplay products added to favorites

router.get("/", auth, async(req, res)=>{
    try{
        const user = req.user.id;
        
        const userToFind = await User.findById(user);
        if(!userToFind){
        res.status(400).json({
        message: "User was not found"
        })
        }
        const userFavorites = await User.findById(user).populate("favorites").select("favorites");

        if(!userFavorites || userFavorites === "" ){
            res.status(400).json({
                message: "User does not have favorite products"
            })
        }
        res.status(200).json({
            message: "Favorite products displayed successfully",
            favorites: userFavorites
        })
        }
    
    catch(error){
        res.status(500).json({
            message: "An error occured",
            error: error.message
        })
    }
})


module.exports = router;