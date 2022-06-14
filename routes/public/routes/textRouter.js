const express = require("express")
const router = express.Router()

const { get_text } = require("../../../controllers/public/textControllers")
router.get("/:id", get_text)
module.exports = router