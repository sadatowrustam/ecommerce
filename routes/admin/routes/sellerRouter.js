const express = require('express');
const router = express.Router()
const {addSeller,isActive,allSellers,oneSeller}=require("../../../controllers/admin/sellerControllers")

router.post("/add",addSeller)
router.post("/isActive",isActive)
router.get("/",allSellers)
router.get("/:id",oneSeller)


module.exports = router;
