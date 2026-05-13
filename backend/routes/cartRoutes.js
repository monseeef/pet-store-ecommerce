const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authToken = require('../middleware/authToken');

router.use(authToken);

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/', cartController.updateCart);
router.delete('/', cartController.clearCart);

// Legacy URL shapes are kept for frontend compatibility, but controllers
// ignore :userId and use req.user.id from the verified JWT.
router.put('/:userId/decrease', cartController.decreaseCart);
router.put('/:userId/increase', cartController.increaseCart);
router.delete('/:userId/:productId', cartController.removeFromCart);
router.get('/:userId', cartController.getCart);
router.post('/:userId', cartController.addToCart);
router.put('/:userId', cartController.updateCart);
router.delete('/:userId', cartController.clearCart);

module.exports = router;
