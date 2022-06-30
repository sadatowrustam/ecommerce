const express = require("express")
const router = express.Router()
const { getAllChats, getOneChat } = require("../../../controllers/admin/chatControllers")
router.get("/", getAllChats)
router.get("/:id", getOneChat)
module.exports = router