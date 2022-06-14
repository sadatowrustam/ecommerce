const express = require("express")
const router = express.Router()
const { addGift, editGift, deleteGift, uploadImage, allGifts, oneGift } = require("../../../controllers/admin/giftController")
const { protect } = require("../../../controllers/admin/adminControllers")

router.get("/", protect, allGifts)
router.get("/:id", oneGift)
router.post("/", protect, addGift)
router.patch("/:id", protect, editGift)
router.delete("/:id", protect, deleteGift)
router.post("/upload-image/:id", protect, uploadImage)
module.exports = router