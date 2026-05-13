const mongoose = require("mongoose");

// Define schema for Pet
const petSchema = new mongoose.Schema(
  {
    image: { type: String },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    isVaccinated: { type: Boolean, required: true},
    location: { type: String, required: true },
    description: { type: String },
    availability: { type: Boolean, required: true },
    CategoryName: {
      type: String,
      ref: "PetCategory",
      required: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
  },
  { timestamps: true }
);

// Create a Pet model
const Pet = mongoose.model("Pet", petSchema);

// Export the Pet model
module.exports = Pet;
