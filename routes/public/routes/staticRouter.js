const express = require("express")
const router = express.Router()
const { getStatic } = require("../../../controllers/public/staticControllers")

router.get("/:id", getStatic)

module.exports = router