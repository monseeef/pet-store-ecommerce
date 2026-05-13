const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishController');
const authToken = require('../middleware/authToken');

router.use(authToken);

router.get('/', wishlistController.getWishlist);
router.post('/:productId', wishlistController.addToWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);

// Legacy URL shapes are kept for frontend compatibility, but controllers
// ignore :userId and use req.user.id from the verified JWT.
router.get('/:userId', wishlistController.getWishlist);
router.post('/:userId/:productId', wishlistController.addToWishlist);
router.delete('/:userId/:productId', wishlistController.removeFromWishlist);
router.get('/wishlist/:userId', wishlistController.getWishlist);
router.post('/wishlist/:userId/:productId', wishlistController.addToWishlist);
router.delete('/wishlist/:userId/:productId', wishlistController.removeFromWishlist);

module.exports = router;
