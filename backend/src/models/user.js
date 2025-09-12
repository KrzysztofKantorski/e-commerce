const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },   //login
  email:    { type: String, required: true, unique: true },   
  password: { type: String, required: true },                 
  role:     { type: String, enum: ["user", "admin"], default:"user" }, // rola użytkownika

  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], 
  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, default: 1 }
  }],
  image: {type: String},
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }], 
  lastLogin: { type: Date },                                        // ostatnie logowanie
  

}, { timestamps: true }); // timestamps = createdAt + updatedAt

module.exports = mongoose.models.User || mongoose.model("User", userSchema);

