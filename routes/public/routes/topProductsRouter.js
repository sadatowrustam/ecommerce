const express = require('express');
const {
  getTopProducts,
} = require('../../../controllers/public/productsControllers');

const router = express.Router();

router.get('/', getTopProducts);

module.exports = router;
