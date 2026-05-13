const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController.js');
const { isAdmin } = require('../middleware/authMiddleware');

// Fetch all products (available for all users)
router.get('/search', productController.searchProducts);

// Admin-only routes for full CRUD operations

router.get('/', productController.getAllProducts);
router.get('/admin', productController.getAllProductsAdmin);
router.get("/populare",productController.getMostPopularProduct);
router.get('/products-per-category', productController.getProductsPerCategory);
router.get('/count',isAdmin, productController.countProduct);
router.post('/',isAdmin, productController.createProduct);
router.get('/category',isAdmin, productController.getAllCategories);
router.get('/:id', productController.getProductById);
router.put('/:id',isAdmin, productController.updateProductById);
router.delete('/:id',isAdmin, productController.deleteProductById);

module.exports = router;
