const express = require("express")
const { allTexts, createText, editText, deleteText } = require("../../../controllers/admin/textController")
const router = express.Router()
router.get("/", allTexts)
router.post("/add", createText)
router.patch("/:id", editText)
router.delete("/:id", deleteText)
module.exports = router