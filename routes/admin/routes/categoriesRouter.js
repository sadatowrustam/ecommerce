const express = require('express');
const {
    addCategory,
    editCategory,
    deleteCategory,
    getOneCategory,
    searchCategory,
    getAllCategories
} = require('../../../controllers/admin/categoriesControllers');;
const { protect } = require("../../../controllers/admin/adminControllers")
const router = express.Router();
router.get('/', protect, getAllCategories);
router.get("/getOne/:category_id", protect, getOneCategory)
router.get("/search", protect, searchCategory)
router.post('/add', protect, addCategory);
router.patch('/edit/:id', protect, editCategory);
router.delete('/delete/:id', protect, deleteCategory);

module.exports = router;