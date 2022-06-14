const express = require('express');
const {
    editCurrency,
    getCurrency,
} = require('../../../controllers/admin/currencyControllers');

const router = express.Router();
const { protect } = require("../../../controllers/admin/adminControllers")

router.get('/', protect, getCurrency);
router.patch('/', protect, editCurrency);

module.exports = router;