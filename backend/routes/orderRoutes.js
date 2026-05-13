const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authToken = require('../middleware/authToken');
const { isAdmin } = require('../middleware/authMiddleware');

// GET all commandes
router.get("/", isAdmin, orderController.getAllOrders);
router.get('/analys', isAdmin, orderController.getOrdersByMonth)
router.get('/count', isAdmin, orderController.countOrder)
router.get('/totalAmount', isAdmin, orderController.getTotalAmount)
router.get('/RO', isAdmin, orderController.getRecentOrders)

//Add new order
router.post("/", authToken, orderController.postOrder);




//UPDATE an existing order
router.put("/:id", isAdmin, orderController.updateOrder);
// DELETE an existing order
router.delete("/:id", isAdmin, orderController.deleteOrder);

router.get("/success/:orderId", authToken, orderController.orderSuccess);
router.get("/reject/:orderId", authToken, orderController.orderReject);
router.get("/my/list", authToken, orderController.getMyOrders);

//GET order by ID
router.get("/:id", authToken, orderController.getOrderById);

module.exports = router;
