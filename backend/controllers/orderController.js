const Order = require("../models/Order");
const { STRIPE_KEY } = require('../config/env');
const stripe = require("stripe")(STRIPE_KEY);
const Product = require("../models/Product")
const User = require("../models/User");

const getAuthenticatedUserId = (req) => req.user?.id || req.userId;

const isPositiveInteger = (value) => {
  const parsedValue = Number(value);
  return Number.isInteger(parsedValue) && parsedValue > 0;
};

const isOrderOwnerOrAdmin = async (order, userId) => {
  const user = await User.findById(userId).select("isAdmin");
  return Boolean(user?.isAdmin || String(order.customer) === String(userId));
};

// Récupérer toutes les commandes
exports.getAllOrders = async (req, res) => {
  try {
    let query = {};

    // Check if status and customer query parameters exist
    const { status, customer, search } = req.query;
    if (status) {
      query.status = status;
    }
    if (customer) {
      query.customer = customer; // customer is the customer ID
    }

    if (search) {
      const searchRegex = new RegExp(search, "i"); // Partial match search
      // Find users whose usernames contain the search term
      const users = await User.find({ username: searchRegex });
      const userIds = users.map(user => user._id);
      query.customer = { $in: userIds }; // Assign the user IDs to the query
    }

    const page = parseInt(req.query.page) || 1; // Get the page number from query parameters, default to 1
    const limit = parseInt(req.query.limit) || 10; // Get the limit from query parameters, default to 10
    const skip = (page - 1) * limit; // Calculating the number of documents to skip

    let ordersQuery = Order.find(query).populate({
      path: 'customer',
      select: 'username', // Select only the username field
    }).populate({
      path: 'products.product', // Populate the products field with product details
      select: 'name', // Select only the name field of the product
    }).skip(skip).limit(limit);

// Check if sorting query parameter exists
const { sortBy } = req.query;
if (sortBy === 'dateAsc') {
  ordersQuery = ordersQuery.sort({ orderDate: 1 }); // Sorting by orderDate in ascending order
} else if (sortBy === 'dateDesc') {
  ordersQuery = ordersQuery.sort({ orderDate: -1 }); // Sorting by orderDate in descending order
} else if (sortBy === 'totalAmountAsc') {
  ordersQuery = ordersQuery.sort({ totalAmount: 1 }); // Sorting by totalAmount in ascending order
} else if (sortBy === 'totalAmountDesc') {
  ordersQuery = ordersQuery.sort({ totalAmount: -1 }); // Sorting by totalAmount in descending order
}


    let orders = await ordersQuery.exec();

    const totalOrdersCount = await Order.countDocuments(query); // Count total number of orders matching the query criteria
    const orderCount = await Order.countDocuments();
    // Calculating total pages
    const totalPages = Math.ceil(totalOrdersCount / limit);

    res.json({
      orders,
      currentPage: page,
      totalPages,
      orderCount
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getRecentOrders = async (req, res) => {
  try {
   
    const recentOrders = await Order.find()
      .sort({ orderDate: -1 }) 
      .limit(6)
      .populate('customer')
    
    res.status(200).json(recentOrders);
  } catch (error) {
    console.error('Error retrieving recent orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


exports.getOrdersByMonth = async (req, res) => {
  try {
      const dataMonth = [
        { name: "January", value: 0 },
        { name: "February", value: 1 },
        { name: "March", value: 2 },
        { name: "April", value: 3 },
        { name: "May", value: 4 },
        { name: "June", value: 5 },
        { name: "July", value: 6 },
        { name: "August", value: 7 },
        { name: "September", value: 8 },
        { name: "October", value: 9 },
        { name: "November", value: 10 },
        { name: "December", value: 11 }
      ];

      const analysData = (dataMonth, orders) => {
        const result = [];
        for (let i = 0; i < dataMonth.length; i++) {
            let accumulator = 0;
            for (let j = 0; j < orders.length; j++) {
                let orderDate = new Date(orders[j].orderDate);
                if (orderDate.getMonth() === dataMonth[i].value) {
                    accumulator++;
                }
            }
            let data = {
                ...dataMonth[i],
                Orders_In_Month : accumulator
            };
            result.push(data);
        }
        return result;
      };

      // Fetch all orders from the database
      const orders = await Order.find();
      // Analyze the orders by month
      const analysisResult = analysData(dataMonth, orders);
      res.json(analysisResult);
  } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer', 'username').populate({
      path: 'products.product',
      select: 'name price',
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (!(await isOrderOwnerOrAdmin(order, getAuthenticatedUserId(req)))) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: getAuthenticatedUserId(req) })
      .sort({ orderDate: -1 })
      .populate("customer", "username")
      .populate({
        path: "products.product",
        select: "name price",
      });

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Add new order
// Endpoint pour le succès de la commande
// exports.orderSuccess = async (req, res) => {
//   try {
//     const orderId = req.params.orderId;
//     // Mettez à jour le statut de la commande comme "Completed"
//     await Order.findOneAndUpdate({ orderId }, { status: 'Completed' });
//     // res.redirect('/success-page'); // Redirigez l'utilisateur vers une page de succès
//     res.send('Payment was successful!')
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Endpoint pour le rejet de la commande
// exports.orderReject = async (req, res) => {
//   try {
//     const orderId = req.params.orderId;
//     // Mettez à jour le statut de la commande comme "Rejected"
//     await Order.findOneAndUpdate({ orderId }, { status: 'Rejected' });
//     res.send('Rejected');
//     // res.redirect('/cancel-page'); // Redirigez l'utilisateur vers une page d'annulation
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
exports.postOrder = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is required" });
    }

    const customer = getAuthenticatedUserId(req);
    const { products } = req.body;
    if (!customer || !products) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products array is required" });
    }

    const orderedProducts = [];
    let totalAmount = 0;

    for (const item of products) {
      const { productId, quantity } = item;
      if (!productId || !isPositiveInteger(quantity)) {
        return res.status(400).json({ message: "Each product requires a valid productId and positive integer quantity" });
      }

      const productDoc = await Product.findById(productId);
      if (!productDoc) {
        return res.status(404).json({ message: `Product with ID ${productId} not found` });
      }
      if (productDoc.stock < quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${productDoc.name}` });
      }

      // Recalculate totals from trusted database prices. Never trust the
      // frontend totalAmount for payment or order records.
      totalAmount += productDoc.price * quantity;
      orderedProducts.push({ product: productId, quantity });
    }

    totalAmount = Number(totalAmount.toFixed(2));
    const orderId = "ORD" + Date.now().toString();
    const orderDate = new Date();

    const newOrder = new Order({
      orderId,
      customer,
      products: orderedProducts,
      totalAmount,
      orderDate
    });

    const savedOrder = await newOrder.save();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "mad",
            product_data: {
              name: "Order",
            },
            unit_amount: Math.round(totalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/api/orders/success/${orderId}`,
      cancel_url: `${req.protocol}://${req.get("host")}/api/orders/reject/${orderId}`,
    });

    res.status(201).json({ url: session.url });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



// exports.orderSuccess = async (req, res) => {
//   try {
//     const orderId = req.params.orderId;
//     await Order.findOneAndUpdate({ orderId }, { status: 'Completed' });
//     res.send('Payment was successful!');
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
exports.orderSuccess = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (!(await isOrderOwnerOrAdmin(order, getAuthenticatedUserId(req)))) {
      return res.status(403).json({ message: "Access denied" });
    }
    if (order.status === "Completed") {
      return res.send('Payment was already completed.');
    }

    // Decrease stock by the purchased quantity only after successful payment.
    // The guarded update prevents overselling if stock changed after checkout
    // session creation and avoids trusting any client-sent inventory values.
    for (const orderedProduct of order.products) {
      const updateResult = await Product.updateOne(
        {
          _id: orderedProduct.product,
          stock: { $gte: orderedProduct.quantity },
        },
        { $inc: { stock: -orderedProduct.quantity } }
      );
      if (updateResult.modifiedCount !== 1) {
        return res.status(409).json({
          message: "Unable to complete order because product stock changed after checkout started",
        });
      }
    }

    order.status = 'Completed';
    await order.save();

    res.send('Payment was successful and stock updated!');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.orderReject = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (!(await isOrderOwnerOrAdmin(order, getAuthenticatedUserId(req)))) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedOrder = await Order.findOneAndUpdate({ orderId }, { status: 'Rejected' }, { new: true }).populate('products.product').populate('customer', 'username');
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//Update order by ID
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params; // Get order ID from URL params
    const { orderId, customer, products, totalAmount, status, orderDate } =
      req.body; // Get updated order data from request body

    // Find the order by ID and update its fields
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        orderId,
        customer,
        products,
        totalAmount,
        status,
        orderDate,
      },
      { new: true }
    ); // Set { new: true } to return the updated document

    // If the order does not exist, return an error response
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Return the updated order as the response
    res.json(updatedOrder);
  } catch (err) {
    // Handle errors
    res.status(400).json({ message: err.message });
  }
};

//Delete order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params; // Get order ID from URL params

    // Find the order by ID and delete it
    const deletedOrder = await Order.findByIdAndDelete(id);

    // If the order does not exist, return an error response
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Return a success message as the response
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    // Handle errors
    res.status(400).json({ message: err.message });
  }
};
//Get total amount of all orders in USD
exports.getTotalAmount = async (req, res) => {
  try {
    const totalAmount = await Order.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
    ]);
    res.json(totalAmount[0].totalAmount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.countOrder = async(req,res)=>{

  const count = await Order.countDocuments();
  res.json(count);
}



