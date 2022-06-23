const express = require('express');
const {
    uploadBannerImageTm,
    uploadBannerImageRu,
    addBanner,
    deleteBanner,
    editBanner,
} = require('../../../controllers/admin/bannerControllers');
const {
    getAllBanners,
    getBanner,
} = require('../../../controllers/public/bannerControllers');
const { protect } = require("../../../controllers/admin/adminControllers")
const router = express.Router();

router.get('/', protect, getAllBanners);
router.get('/:id', protect, getBanner);
router.post('/add', protect, addBanner);
router.patch("/:id", protect, editBanner)
router.delete('/:id', protect, deleteBanner);
router.post('/upload-image-tm/:id', protect, uploadBannerImageTm);
router.post("/upload-image-ru/:id", protect, uploadBannerImageRu)
module.exports = router;