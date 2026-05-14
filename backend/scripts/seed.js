require("dotenv").config();

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Category = require("../models/category");
const Pet = require("../models/Pet");
const PetCategory = require("../models/PetCategory");
const Product = require("../models/Product");
const User = require("../models/User");

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

const {
  SEED_ADMIN_EMAIL = "dev_admin@example.com",
  SEED_ADMIN_PASSWORD,
  SEED_USER_EMAIL = "dev_customer@example.com",
  SEED_USER_PASSWORD,
} = process.env;

const usernameFromEmail = (email) => email.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "_");

const ensureRequiredEnv = () => {
  const missing = [
    ["MONGO_URI or MONGODB_URI", mongoUri],
    ["SEED_ADMIN_PASSWORD", SEED_ADMIN_PASSWORD],
    ["SEED_USER_PASSWORD", SEED_USER_PASSWORD],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required seed environment variables: ${missing.join(", ")}`);
  }
};

const connect = async () => {
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 15000,
  });
};

const upsertUser = async ({ email, password, isAdmin }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const username = usernameFromEmail(email);

  return User.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      $set: {
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
        isAdmin,
      },
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  ).select("-password -resetPasswordToken -resetPasswordExpire");
};

const upsertCategory = (name, description) =>
  Category.findOneAndUpdate(
    { name },
    { $set: { name, description } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

const upsertPetCategory = (name, description) =>
  PetCategory.findOneAndUpdate(
    { name },
    { $set: { name, description } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const upsertProduct = ({ name, price, description, category, stock, image }) =>
  Product.findOneAndUpdate(
    { name },
    {
      $set: {
        name,
        slug: slugify(name),
        id: slugify(name),
        price,
        description,
        category: category._id,
        stock,
        image,
      },
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

const upsertPet = ({ name, age, gender, isVaccinated, location, description, availability, CategoryName, image, userId }) =>
  Pet.findOneAndUpdate(
    { name, location },
    {
      $set: {
        name,
        age,
        gender,
        isVaccinated,
        location,
        description,
        availability,
        CategoryName,
        image,
        userId,
      },
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

const seed = async () => {
  ensureRequiredEnv();
  await connect();

  console.log("Seeding development-only users and products...");

  const admin = await upsertUser({
    email: SEED_ADMIN_EMAIL,
    password: SEED_ADMIN_PASSWORD,
    isAdmin: true,
  });

  const customer = await upsertUser({
    email: SEED_USER_EMAIL,
    password: SEED_USER_PASSWORD,
    isAdmin: false,
  });

  const food = await upsertCategory("Food & Treats", "Premium daily nutrition and reward treats for pets.");
  const toys = await upsertCategory("Toys & Enrichment", "Playful toys, chews, and enrichment essentials.");
  const care = await upsertCategory("Grooming & Care", "Gentle grooming and everyday wellness products.");
  const cats = await upsertPetCategory("Cats", "Adoptable cats and kittens.");
  const dogs = await upsertPetCategory("Dogs", "Adoptable dogs and puppies.");

  const products = await Promise.all([
    upsertProduct({
      name: "Petopia Puppy Growth Kibble",
      price: 24.99,
      description: "Balanced dry food made for growing puppies and everyday healthy routines.",
      category: food,
      stock: 18,
      image: "/product-placeholder.svg",
    }),
    upsertProduct({
      name: "Salmon Crunch Cat Treats",
      price: 8.49,
      description: "Crunchy salmon rewards for cats who appreciate a little ceremony.",
      category: food,
      stock: 30,
      image: "/product-placeholder.svg",
    }),
    upsertProduct({
      name: "Braided Rope Tug Toy",
      price: 11.99,
      description: "Durable rope toy for daily tug, fetch, and supervised play sessions.",
      category: toys,
      stock: 14,
      image: "/product-placeholder.svg",
    }),
    upsertProduct({
      name: "Gentle Oat Pet Shampoo",
      price: 13.75,
      description: "Soft oat-based shampoo for dogs and cats with sensitive coats.",
      category: care,
      stock: 20,
      image: "/product-placeholder.svg",
    }),
  ]);

  const seededPets = await Promise.all([
    upsertPet({
      name: "Milo",
      age: 2,
      gender: "male",
      isVaccinated: true,
      location: "Casablanca",
      description: "A playful tabby who loves sunny windows, feather toys, and patient introductions.",
      availability: true,
      CategoryName: cats.name,
      image: "/product-placeholder.svg",
      userId: customer._id,
    }),
    upsertPet({
      name: "Luna",
      age: 1,
      gender: "female",
      isVaccinated: true,
      location: "Rabat",
      description: "A gentle young cat with a calm personality and a soft spot for cozy blankets.",
      availability: true,
      CategoryName: cats.name,
      image: "/product-placeholder.svg",
      userId: customer._id,
    }),
    upsertPet({
      name: "Rocky",
      age: 3,
      gender: "male",
      isVaccinated: true,
      location: "Marrakech",
      description: "A cheerful dog who enjoys long walks, treat puzzles, and friendly people.",
      availability: true,
      CategoryName: dogs.name,
      image: "/product-placeholder.svg",
      userId: customer._id,
    }),
    upsertPet({
      name: "Nala",
      age: 4,
      gender: "female",
      isVaccinated: false,
      location: "Tangier",
      description: "A sweet companion with a quiet temperament, best suited for a relaxed home.",
      availability: false,
      CategoryName: dogs.name,
      image: "/product-placeholder.svg",
      userId: customer._id,
    }),
  ]);

  console.log(`Seeded admin: ${admin.email} role=admin`);
  console.log(`Seeded user: ${customer.email} role=customer`);
  console.log(`Seeded in-stock products: ${products.length}`);
  console.log(`Seeded adoptable pets: ${seededPets.length}`);
};

seed()
  .then(async () => {
    await mongoose.disconnect();
    console.log("Development seed complete.");
  })
  .catch(async (error) => {
    console.error(error.message || error);
    await mongoose.disconnect();
    process.exit(1);
  });
