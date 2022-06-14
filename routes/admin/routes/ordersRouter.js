const express = require('express');
const {
    getAllOrders,
    getOrderProducts,
    changeOrderStatus,
    deleteOrderProduct,
    editProduct,
    deleteOrder,
    hasabat,
    giveCheck
} = require('../../../controllers/admin/ordersControllers');

const router = express.Router();
const { protect } = require("../../../controllers/admin/adminControllers")

router.get('/', protect, getAllOrders);
router.delete('/order-products/delete/:id', protect, deleteOrderProduct);
router.get('/order-products/:id', protect, getOrderProducts);
router.patch("/product/:id", protect, editProduct)
router.post('/status/:id', protect, changeOrderStatus);
router.delete("/:id", protect, deleteOrder)
router.get("/hasabat", hasabat)
router.get("/check/:id/check", giveCheck)
module.exports = router;