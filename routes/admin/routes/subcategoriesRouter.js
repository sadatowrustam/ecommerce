const express = require('express');
const {
    addSubcategory,
    editSubcategory,
    deleteSubcategory,
    getOne
} = require('../../../controllers/admin/subcategoriesControllers');
const { protect } = require("../../../controllers/admin/adminControllers")
const router = express.Router();
router.get("/getOne/:id", protect, getOne)
router.post('/add', protect, addSubcategory);
router.patch('/edit/:id', protect, editSubcategory);
router.delete('/delete/:id', protect, deleteSubcategory);

module.exports = router;