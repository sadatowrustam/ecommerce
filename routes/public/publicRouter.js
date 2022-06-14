const express = require('express');
const { sendMyMail } = require('../../controllers/public/contactusControllers');
const router = express.Router();

router.post('/contact-us', sendMyMail);
router.use('/banners', require('./routes/bannersRouter'));
router.use('/categories', require('./routes/categoriesRouter'));
router.use('/sub-categories', require('./routes/subcategoriesRouter'));
router.use("/brands", require("./routes/brandsRouter"))
router.use('/products', require('./routes/productsRouter'));
router.use("/orders", require("./routes/ordersRouter"))
router.use("/static", require("./routes/staticRouter"))
router.use("/texts", require("./routes/textRouter"))
module.exports = router;