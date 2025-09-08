const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Product = require("../models/product");
const auth = require("../validators/login");


//delate product from favorites

router.delete("/remove/:productId", auth, async(req, res)=>{
    try{
        const user = req.user.id;
        const {productId} = req.params;
        const userToFind = await User.findById(user);

        if(!userToFind){
        return res.status(400).json({
        message: "User was not found"
        })
        }
        const productToFind = await Product.findById(productId);
         
        if(!productToFind){
         return res.status(404).json({
            message: "Product was not found"
        })
         }
        //check if product is alerdy in favorites
           const isInFavorites = userToFind.favorites.includes(productId);
        if(!isInFavorites){
            return res.status(400).json({
                message: "Product is not in favorites"
            });
        }
      
            userToFind.favorites = userToFind.favorites.filter(id => id.toString() !== productId);
            await userToFind.save()
             
            res.status(200).json({
            message: "Product deleted from favorites"
        })
       
            
        
        }
    
    catch(error){
        res.status(500).json({
            message: "An error occured",
            error: error.message
        })
    }
})

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
      const isAlreadyInFavorites = userToFind.favorites.some(
       (favoriteId) => favoriteId && favoriteId.toString() === productId
    );

    if (isAlreadyInFavorites) {
      return res.status(400).json({
        message: "Product is already in favorites"
      });
    }
      
            await userToFind.favorites.push(productToFind._id)
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
            favorites: userFavorites.favorites
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