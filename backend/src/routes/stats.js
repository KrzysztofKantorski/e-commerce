const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const auth = require("../validators/login");

router.get("/", auth, async(req, res)=>{
    try{

    
    const user = req.user.id;
        const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
        dateFilter.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }
    const userWithOrders = await User.findById(user).populate({
        path: "orders",
        match: dateFilter,
        options: {sort: {createdAt: -1}},
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

    const orders = userWithOrders.orders;

    //orders by status (how much is paid, cancelled etc..)
    const statusData = orders.reduce((acc, order)=>{
        acc[order.status] = (acc[order.status] || 0) +1;
        return acc
    }, {})

    //revenue by month
    const revenueByMonth = orders.reduce((acc, order)=>{
        const month = new Date(order.createdAt).toLocaleDateString('default', {month: 'short'})
        acc[month] = (acc[month] || 0) + order.totalPrice;
        return acc;
    }, {})

    //Top products 
    const productSales = {};
    orders.forEach(order=>{
        order.products.forEach(item=>{
            const productName = item.product?.name || 'Unknown product';
            productSales[productName] = (productSales[productName] || 0) + item.quantity;
        })
    })

    res.status(200).json({
        message: "Order statistics retrieved successfully",
        stats: {
            totalOrders: orders.length,
            totalRevenue: orders.reduce((sum, order) => sum + order.totalPrice, 0), 
            statusDistribution: statusData,
            revenueByMonth: revenueByMonth,
            productSales: productSales
        }
    })
}
    catch(error){
        res.status(500).json({
            message: "An error occurred",
            error: error.message
        });
    }
})
module.exports = router