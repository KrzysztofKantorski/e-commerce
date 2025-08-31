const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
    name:        { type: String, required: true },  // nazwa produktu
    description: { type: String },                  // opis
    price:       { type: Number, required: true },  // cena
    stock:       { type: Number, default: 0 },      // ile sztuk na stanie
    category:    { type: String },                  // np. elektronika, moda
    images:      [{ type: String }],                // linki do zdjęć produktu
    reviews: [reviewSchema], // ⬅ tu dodajemy komentarze
    averageRating: { type: Number, default: 1 }

}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);