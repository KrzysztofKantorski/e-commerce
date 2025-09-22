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


router.get("/users", auth, async(req, res)=>{
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

    //all users
    const allUsers = await User.find(dateFilter).populate({
        path: "orders",
        match: dateFilter,
        populate:{
            path: "products.product",
            model: "Product"
        }
    })
    if (!allUsers || allUsers.length === 0) {
            return res.status(404).json({
                message: "No users found"
            });
    }
    console.log(allUsers)
    //Users by role
    const roleDistribution = allUsers.reduce((acc, user)=>{
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
    }, {})

   //Users with the most orders (top 10)
  const usersByOrders = allUsers
    .map(user => ({
        [user.username]: user.orders.length
    }))
    .sort((a, b) => Object.values(b)[0] - Object.values(a)[0])
    .slice(0, 10)
    .reduce((acc, item) => {
        const key = Object.keys(item)[0];
        const value = Object.values(item)[0];
        acc[key] = value;
        return acc;
    }, {});
    //Users with the most expenses
    const usersBySpending = allUsers
    .sort((a, b) => {
        const aTotal = a.orders.reduce((sum, order) => sum + order.totalPrice, 0);
        const bTotal = b.orders.reduce((sum, order) => sum + order.totalPrice, 0);
        return bTotal - aTotal;
    })
    .slice(0, 10)
    .reduce((acc, user) => {
        const totalSpent = user.orders.reduce((sum, order) => sum + order.totalPrice, 0);
        acc[user.username] = totalSpent;
        return acc;
    }, {});


    //New users by month
        const newUsersByMonth = allUsers.reduce((acc, user) => {
            const month = new Date(user.createdAt).toLocaleDateString('default', {month: 'short' });
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});

res.status(200).json({
    message: "User statistics retrieved successfully",
    stats: {
        totalUsers: allUsers.length,
        roleDistribution: roleDistribution,
        newUsersByMonth: newUsersByMonth,
        topUsersByOrders: usersByOrders,
        topUsersBySpending: usersBySpending
        
    }
});
}
    catch(error){
        res.status(500).json({
            message: "An error occurred",
            error: error.message
        });
    }
})



module.exports = router