const express = require("express")
const router = express.Router()
const { addMyOrders } = require("../../../controllers/public/ordersControllers")
router.post("/add", addMyOrders)


module.exports = router