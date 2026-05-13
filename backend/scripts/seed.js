require("dotenv").config();

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Category = require("../models/category");
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

  const food = await upsertCategory("Development Food", "Development-only seed category for pet food.");
  const toys = await upsertCategory("Development Toys", "Development-only seed category for pet toys.");
  const care = await upsertCategory("Development Care", "Development-only seed category for pet care.");

  const products = await Promise.all([
    upsertProduct({
      name: "Dev Premium Puppy Kibble",
      price: 24.99,
      description: "Development seed product: balanced dry food for growing puppies.",
      category: food,
      stock: 18,
      image: "/product-placeholder.svg",
    }),
    upsertProduct({
      name: "Dev Salmon Cat Treats",
      price: 8.49,
      description: "Development seed product: crunchy salmon treats for cats.",
      category: food,
      stock: 30,
      image: "/product-placeholder.svg",
    }),
    upsertProduct({
      name: "Dev Rope Tug Toy",
      price: 11.99,
      description: "Development seed product: durable rope toy for daily play.",
      category: toys,
      stock: 14,
      image: "/product-placeholder.svg",
    }),
    upsertProduct({
      name: "Dev Gentle Pet Shampoo",
      price: 13.75,
      description: "Development seed product: gentle shampoo for dogs and cats.",
      category: care,
      stock: 20,
      image: "/product-placeholder.svg",
    }),
  ]);

  console.log(`Seeded admin: ${admin.email} role=admin`);
  console.log(`Seeded user: ${customer.email} role=customer`);
  console.log(`Seeded in-stock products: ${products.length}`);
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
