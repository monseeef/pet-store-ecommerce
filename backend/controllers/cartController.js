const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getAuthenticatedUserId = (req) => req.user?.id || req.userId;

const normalizeQuantity = (quantity) => {
    const parsedQuantity = Number(quantity);
    return Number.isInteger(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : null;
};

module.exports.getCart = async (req, res) => {
    const userId = getAuthenticatedUserId(req);
    try {
        const cart = await Cart.findOne({ userId }).populate('items.product');
        if (cart) {
            res.status(200).json(cart);
        } else {
            res.status(200).json({ userId, items: [], bill: 0 });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports.addToCart = async (req, res) => {
    // Use the authenticated user from the JWT. The URL userId is ignored
    // to prevent users from adding items to another account's cart.
    const userId = getAuthenticatedUserId(req);
    const { productId } = req.body;
    const quantity = normalizeQuantity(req.body.quantity);
    if (!quantity) {
        return res.status(400).json({ message: 'Quantity must be a positive integer' });
    }
    
    try {
        let cart = await Cart.findOne({ userId });
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        if (cart) {
            const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
            if (itemIndex > -1) {
                const nextQuantity = cart.items[itemIndex].quantity + quantity;
                if (product.stock < nextQuantity) {
                    return res.status(400).json({ message: 'Insufficient stock' });
                }
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
            cart.bill += product.price * quantity;
        } else {
            cart = new Cart({
                userId,
                items: [{ product: productId, quantity }],
                bill: product.price * quantity
            });
        }

        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports.updateCart = async (req, res) => {
    const userId = getAuthenticatedUserId(req);
    const { items } = req.body;  // Expecting items to be an array of { productId, quantity }

    if (!Array.isArray(items)) {
        return res.status(400).json({ message: 'Items must be an array' });
    }

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        let bill = 0;
        const newItems = [];
        for (const item of items) {
            const product = await Product.findById(item.product); // Await the product lookup
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.product} not found` });
            }
            const quantity = normalizeQuantity(item.quantity);
            if (!quantity) {
                return res.status(400).json({ message: 'Quantity must be a positive integer' });
            }
            if (product.stock < quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }
            bill += product.price * quantity;
            newItems.push({ product: item.product, quantity });
        }

        cart.items = newItems;
        cart.bill = bill;
        await cart.save();
        const updatedCart = await Cart.findOne({ userId }).populate('items.product'); // Populate after save
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// module.exports.decreaseCart = async (req, res) => {
//     const { userId } = req.params;
//     const { productId } = req.body;
  
//     try {
//       const cart = await Cart.findOne({ userId });
//       const item = cart.items.find(item => item.product.equals(productId));
  
//       if (item.quantity > 1) {
//         item.quantity--;
//         await cart.save();
//         res.json({ items: cart.items, bill: cart.bill });
//       } else {
//         res.status(400).json({ message: "Quantity cannot be less than 1" });
//       }
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   }

//   module.exports.increaseCart = async (req, res) => {
//     const { userId } = req.params;
//     const { productId } = req.body;
  
//     try {
//       const cart = await Cart.findOne({ userId });
//       const item = cart.items.find(item => item.product.equals(productId));
  
//       if (item) {
//         item.quantity++;
//         await cart.save();
//         res.json({ items: cart.items, bill: cart.bill });
//       } else {
//         res.status(400).json({ message: "Item not found in cart" });
//       }
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   }
module.exports.decreaseCart = async (req, res) => {
    const userId = getAuthenticatedUserId(req);
    const { productId } = req.body;
  
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      const item = cart.items.find(item => item.product.equals(productId));
      if (!item) {
        return res.status(404).json({ message: "Item not found in cart" });
      }
  
      if (item.quantity > 1) {
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
  
        item.quantity--;
        cart.bill -= product.price;
        await cart.save();
        const updatedCart = await Cart.findOne({ userId }).populate('items.product'); // Populate after save
        res.json(updatedCart);
      } else {
        res.status(400).json({ message: "Quantity cannot be less than 1" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
  module.exports.increaseCart = async (req, res) => {
    const userId = getAuthenticatedUserId(req);
    const { productId } = req.body;
  
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      const item = cart.items.find(item => item.product.equals(productId));
  
      if (item) {
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
        if (product.stock < item.quantity + 1) {
          return res.status(400).json({ message: "Insufficient stock" });
        }
  
        item.quantity++;
        cart.bill += product.price;
        await cart.save();
        const updatedCart = await Cart.findOne({ userId }).populate('items.product'); // Populate after save
        res.json(updatedCart);
      } else {
        res.status(400).json({ message: "Item not found in cart" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
module.exports.removeFromCart = async (req, res) => {
    const userId = getAuthenticatedUserId(req);
    const { productId } = req.params;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
        if (itemIndex > -1) {
            const product = await Product.findById(productId);
            if (product) {
                cart.bill -= product.price * cart.items[itemIndex].quantity;
                cart.items.splice(itemIndex, 1);
                await cart.save();
                res.status(200).json(cart);
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports.clearCart = async (req, res) => {
    const userId = getAuthenticatedUserId(req);

    try {
      // Find the cart by user ID
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      // Clear the cart items and reset the bill
      cart.items = [];
      cart.bill = 0;
      await cart.save();
  
      res.json({ items: cart.items, bill: cart.bill });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

