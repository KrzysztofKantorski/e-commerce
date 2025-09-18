const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
    name:        { type: String, required: true },  
    description: { type: String },                  
    price:       { type: Number, required: true },  
    stock:       { type: Number, default: 0 },      
    category:    { type: String },                  
    images:      [{ type: String }],                
    reviews: [reviewSchema], 
    averageRating: { type: Number, default: 1 },
    discount: {type: Number, default: 0}

}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);