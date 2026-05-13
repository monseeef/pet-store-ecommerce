const PetCategory = require('../models/PetCategory');
const Product = require('../models/Product');
// const Customer = require('../models/Customer');

// Function to add a new pet category
exports.addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if(!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        
        // Check if the category already exists
        const existingCategory = await PetCategory.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const petCategory = new PetCategory({ name, description });
        await petCategory.save();
        res.status(201).json(petCategory);
    } catch (error) {
        res.status(400).json(error);
    }
};

// Function to get all pet categories
// exports.getCategories = async (req, res) => {
//     try {
//         const categories = await PetCategory.find();
//         res.status(200).json(categories);
//     } catch (error) {
//         res.status(400).json(error);
//     }
// };
exports.getCategories = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1); // Parse page number from query parameters, default to 1 if not provided
        const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1); // Parse limit from query parameters, default to 10 if not provided
        const skip = (page - 1) * limit;

        const categories = await PetCategory.find().skip(skip).limit(limit);
        const totalCategories = await PetCategory.countDocuments();

        const totalPages = Math.ceil(totalCategories / limit);

        res.status(200).json({
            categories,
            currentPage: page,
            totalPages
        });
    } catch (error) {
        console.error("Error fetching pet categories:", {
            message: error.message,
            code: error.code,
            stack: error.stack,
        });
        res.status(500).json({ message: "An error occurred while fetching pet categories." });
    }
};
// Function to get pet category by name
exports.getCategoryByName = async (req, res) => {
    try {
        const { category } = req.params;
        const petCategory = await PetCategory.findOne({ name: category });
        if (!petCategory) {
            return res.status(404).json("Pet Category not found");
        }
        res.json(petCategory);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Function to update pet category by name
exports.updateCategoryByName = async (req, res) => {
    try {
        const { category } = req.params;
        const { name } = req.body;

        const updatedCategory = await PetCategory.findOneAndUpdate({ name: category }, { name }, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        res.status(500).json(error);
    }
};

// Function to delete pet category by name
exports.deleteCategoryByName = async (req, res) => {
    try {
        const { category } = req.params;

        const deletedCategory = await PetCategory.findOneAndDelete({ name: category });
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
};

// Function to search for categories, products, and customers
exports.searchAll = async (req, res) => {
    try {
        const { query } = req.params;

        // Search for categories
        const categories = await PetCategory.find({ name: { $regex: query, $options: 'i' } });

        // Search for products
        const products = await Product.find({ name: { $regex: query, $options: 'i' } });

        // Search for customers
        const customers = await Customer.find({ name: { $regex: query, $options: 'i' } });

        res.status(200).json({ categories, products, customers });
    } catch (error) {
        res.status(500).json(error);
    }
};
