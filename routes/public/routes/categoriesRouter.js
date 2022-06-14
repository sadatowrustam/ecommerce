const express = require('express');
const {
    getAllCategories,
    getCategoryProducts,
    getVip
} = require('../../../controllers/public/categoriesControllers');

const router = express.Router();

router.get('/', getAllCategories);
// router.get("/vip",getVip)
router.get('/products/:id', getCategoryProducts);

module.exports = router;