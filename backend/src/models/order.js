require('dotenv').config();
const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, required: true }
  }], 

   shippingAddress: {
    fullName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String }
  },

  totalPrice: { type: Number, required: true }, 
  status: { 
    type: String, 
    enum: ["pending", "paid", "shipped", "delivered", "cancelled"], 
    default: "pending" 
  },
  payment: { 
    type: String, 
    enum: ["blik", "paysafecard", "paypal", "credit card", "not paid"], 
    default: "not paid" 
  },
}, { timestamps: true });







module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);