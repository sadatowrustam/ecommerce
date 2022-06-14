const express = require('express');
const {
    editStatic
} = require('../../../controllers/admin/staticControllers');
const {
    getStatic
} = require('../../../controllers/public/staticControllers');
const { protect } = require("../../../controllers/admin/adminControllers")
const router = express.Router();

router.get('/:id', protect, getStatic);
router.patch("/:id", protect, editStatic)

module.exports = router;