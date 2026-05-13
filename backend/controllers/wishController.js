const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

const getAuthenticatedUserId = (req) => req.user?.id || req.userId;

module.exports.getWishlist = async (req, res) => {
    const userId = getAuthenticatedUserId(req);
    try {
        const wishlist = await Wishlist.findOne({ userId }).populate('products');
        if (wishlist) {
            res.status(200).json(wishlist);
        } else {
            res.status(200).json({ userId, products: [] });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports.addToWishlist = async (req, res) => {
    // Use the authenticated user from the JWT. The URL userId is ignored
    // to prevent users from writing to another account's wishlist.
    const userId = getAuthenticatedUserId(req);
    const productId = req.params.productId;
    
    try {
        let wishlist = await Wishlist.findOne({ userId });
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (wishlist) {
            if (!wishlist.products.some((item) => item.equals(productId))) {
                wishlist.products.push(productId);
                await wishlist.save();
            }
        } else {
            wishlist = new Wishlist({
                userId,
                products: [productId]
            });
            await wishlist.save();
        }

        res.status(201).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports.removeFromWishlist = async (req, res) => {
    const userId = getAuthenticatedUserId(req);
    const productId = req.params.productId;

    try {
        const wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        const index = wishlist.products.findIndex((item) => item.equals(productId));
        if (index !== -1) {
            wishlist.products.splice(index, 1);
            await wishlist.save();
            res.status(200).json(wishlist);
        } else {
            res.status(404).json({ message: 'Product not found in wishlist' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
