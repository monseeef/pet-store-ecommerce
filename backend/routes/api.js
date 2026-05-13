const express = require("express");
const router = express.Router();
const orderRoutes = require("./orderRoutes.js");
const productRoutes = require("./productRoutes.js");
const userRoutes = require("./userRoutes.js");
const authRoutes = require("./authRoutes.js");
const categoryRoutes = require("./categoryRoutes.js");
const petRoutes = require("./petRouter.js");
const PetCategoryRoutes = require("./PetCategoryRouter.js");
const cartRoutes = require("./cartRoutes.js");
const wishlistRoutes = require("./wishlistRoutes.js");

router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/pets", petRoutes);
router.use("/petCategories", PetCategoryRoutes);
router.use("/cart", cartRoutes);
router.use("/wishes", wishlistRoutes);

module.exports = router;
