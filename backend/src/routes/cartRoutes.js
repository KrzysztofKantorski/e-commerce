const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const auth = require("../validators/login");

//add product to cart
router.post("/", auth, async(req, res)=>{
    try {
        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body; // Zmiana z req.query na req.body

        // Check if user exists
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({
                message: "User was not found"
            });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if(!product) {
            return res.status(404).json({
                message: "Product was not found"
            });
        }

        // Check if product is already in cart
        const existingCartItem = user.cart.find(
            item => item.product.toString() === productId
        );

        if(existingCartItem) {
            // Product is in cart - change quantity
            existingCartItem.quantity += parseInt(quantity);
        } else {
            // Add to cart
            user.cart.push({
                product: productId,
                quantity: parseInt(quantity)
            });
        }

        await user.save();
        
        res.status(201).json({
            message: "Product added successfully",
            cart: user.cart
        });
    }
    catch(error) {
        res.status(500).json({
            message: "An error occurred",
            error: error.message
        });
    }

})


//display user cart
router.get("/", auth, async(req, res)=>{
    try{
    const user =  req.user.id;
    const userToFind = await User.findById(user).populate("cart.product");
    console.log(userToFind.cart)
    if(!userToFind){
         res.status(404).json({
            message: "User was not found"
        })
    }
    res.status(200).json({
        message: "Cart displayed successfully",
        cart: userToFind.cart
    })

    }
    catch(error){
        res.status(500).json({
        message: "An error occured",
        error: error.message
    })
    }
   
})


//change quantity of product
router.put("/:productId", auth, async(req, res)=>{
    try{
    const user =  req.user.id;
    const {quantity} = req.body;
    const {productId} = req.params;
    const userToFind = await User.findById(user);
    if(!userToFind){
         res.status(404).json({
            message: "User was not found"
        })
    }

    //find product in user cart
   const cartItem = userToFind.cart.find(
      (item) => item.product.toString() === productId
    );

    if(!cartItem){
         res.status(404).json({
            message: "Product was not found in cart"
        })
    }
    console.log(cartItem)
    //check if quantity didn`t change
    if(cartItem.quantity == quantity || quantity < 1){
      return(
        res.status(400).json({
        message: "Incorrect number"
        })  
      )   
    }

    cartItem.quantity = quantity;
    
    await userToFind.save();
    res.status(200).json({
        message: "Quantity updated successfully",
        cart: userToFind.cart
    })

    }
    catch(error){
        res.status(500).json({
        message: "An error occured",
        error: error.message
    })
    }
   
})


//delete product
router.delete("/:productId", auth, async(req, res)=>{
    try{
    const user =  req.user.id;
    const { productId } = req.params;
    
    const userToFind = await User.findById(user);
    if(!userToFind){
         res.status(404).json({
            message: "User was not found"
        })
    }

    //find product in user cart
   const cartItem = userToFind.cart.find(
      (item) => item.product.toString() === productId
    );

    if(!cartItem){
         res.status(404).json({
            message: "Product was not found in cart"
        })
    }
    userToFind.cart = userToFind.cart.filter((item)=> item.product.toString() !== productId);
    await userToFind.save();
    res.status(200).json({
        message: "Product deleted from cart successfully",
        cart: userToFind.cart
    })

    }
    catch(error){
        res.status(500).json({
        message: "An error occured",
        error: error.message
    })
    }
   
})

module.exports = router