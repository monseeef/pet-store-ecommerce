const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
  },
  id: {
    type: String,
    unique: true,
    sparse: true,
  },
  price: {
    type: Number, 
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Reference to the Category model
  },
  petCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PetCategory", // Reference to the PetCategory model
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock can not be less than 0.']
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("Product", productSchema);
