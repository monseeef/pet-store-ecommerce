const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/productController');
const {isAdmin} = require('../middleware/authMiddleware')

router.get('/', categoryController.getAllCategories);
router.post('/',isAdmin, categoryController.createCategories);
router.get("/:id", /*isAdmin, */ categoryController.getCategoryDetailsById);
router.put('/:id',isAdmin, categoryController.updateCategory);
router.delete('/:id',isAdmin, categoryController.deleteCategoryById);

module.exports = router;