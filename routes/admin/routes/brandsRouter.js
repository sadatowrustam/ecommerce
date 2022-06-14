const express = require('express');
const {
    addBrand,
    editBrand,
    deleteBrand,
    uploadBrandImage,
    addBrandCategory,
    deleteBrandCategory,
    getBrand,
    getUnlimited,
    getAllBrands
} = require('../../../controllers/admin/brandsControllers');

const { protect } = require("../../../controllers/admin/adminControllers")
const router = express.Router();
router.get('/', protect, getAllBrands);
router.get("/all", protect, getUnlimited)
router.get("/:id", protect, getBrand)
router.post('/add', protect, addBrand);
router.post('/add-category/:id', protect, addBrandCategory);
router.patch('/:id', protect, editBrand);
router.delete('/:id', protect, deleteBrand);
router.delete('/delete-category', protect, deleteBrandCategory);
router.post('/upload-image/:id', protect, uploadBrandImage);

module.exports = router;