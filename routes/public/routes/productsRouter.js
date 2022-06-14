const express = require('express');
const {
    searchProducts,
    getOneProduct,
    discount,
    newProducts,
    actionProducts,
    giftProducts,
    setRating,
    getProducts
} = require('../../../controllers/public/productsControllers');

const router = express.Router();
router.get("/", getProducts)
router.get('/search', searchProducts);
router.get("/discount", discount)
router.get("/new", newProducts)
router.get("/action", actionProducts)
router.get("/gift", giftProducts)
router.get("/:id", getOneProduct)
router.post("/set-rating/:id", setRating)

module.exports = router;