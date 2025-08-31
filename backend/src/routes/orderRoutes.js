const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const auth = require("../validators/login");


//create order
router.post("/", auth, async(req, res)=>{
    try{
    const user =  req.user.id;
    const { shippingAddress } = req.body;
    const userToFind = await User.findById(user).populate("cart.product");
    if (!userToFind) {
      return res.status(404).json({ message: "User not found" });
    }
    const userCart = userToFind.cart;
    
   if(!userToFind.cart || userCart.length === 0){
     return res.status(400).send({
        message: "Cart is empty"
    })
   }

    //calculate total price
    let total = 0;

    const orderItems = userCart.map((item)=>{
        total+= item.product.price * item.quantity;

        //get all products from cart
        return{
            product: item.product._id,
            quantity: item.quantity
        }
    })

    //create order
    const newOrder = new Order({
        user: user,
        products: orderItems,
        totalPrice: total,
        shippingAddress
    });

    await newOrder.save();

    //save order to user
    userToFind.orders.push(newOrder._id);

    //empty user cart
    userToFind.cart = [];

    await userToFind.save();
    res.status(200).send({
        message: "Success",
        order: newOrder
    })

    } 
    catch(error){
        res.status(500).send({
        message: "Success",
        error: error.message
    })
    }
   
})

//display user orders
router.get("/", auth, async(req, res)=>{
    try{
    const user = req.user.id;
    const userWithOrders = await User.findById(user).populate({
        path: "orders",
        populate:{
            path: "products.product",
            model: "Product"
        }
    })
    if(!userWithOrders){
        res.status(500).json({
            message: "User was not found"
        })
    }
        res.status(200).json({
            message: "Orders displayed successfully",
            orders: userWithOrders.orders
        })
    } 
    catch(error){
        res.status(500).json({
            message: "An error occured",
            error: error.message
         })
    }
   
})

//display specific order
router.get("/:id", auth, async(req, res)=>{
    try{
    const user = req.user.id;
    const orderId = req.params.orderId;
    if(!user || user.role!="admin"){
        return res.status(404).json({
            message: "Unauthorized user"
        })
    }
    const order = await Order.findById(orderId)
   if (!order) {
    return res.status(404).json({ message: "Order not found" })
    };

    await order.save();

    res.status(200).json({
      message: "Order displayed successfully",
      order: order
    });
   
    } 
    catch(error){
        res.status(500).json({
            message: "An error occured",
            error: error.message
         })
    }
   
})




//display one order from user
router.get("/:id", auth, async(req, res)=>{
    try{
    const {id} = req.params;
    const user = req.user.id;
    const userWithOrders = await User.findById(user).populate({
        path: "orders",
        populate:{
            path: "products.product",
            model: "Product"
        }
    })
    if(!userWithOrders){
        res.status(404).json({
            message: "User was not found"
        })
    }
    const findOrder = userWithOrders.orders.find(order => order._id.toString() === id);
    if(!findOrder){
        res.status(404).json({
            message: `Order with id: ${id} was not found`
         })
    }
    res.status(200).json({
            message: "Order displayed successfully",
            order: findOrder
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