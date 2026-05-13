const express = require("express");
const router = express.Router();
// const petCategoryController = require('../controllers/petCategoryController');
const petCategoryController = require("../controllers/petCategoryController");
const { isAdmin } = require("../middleware/authMiddleware");

// Routes for pet categories
router.get('/', petCategoryController.getCategories);
router.post('/', isAdmin, petCategoryController.addCategory);
router.get('/:category', petCategoryController.getCategoryByName);
router.put('/:category', isAdmin, petCategoryController.updateCategoryByName);
router.delete('/:category', isAdmin, petCategoryController.deleteCategoryByName);

module.exports = router;
