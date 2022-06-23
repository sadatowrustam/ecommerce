// const sharp = require('sharp');
const fs = require('fs');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const sharp = require("sharp")
const { Banners, Products } = require('../../models');

exports.addBanner = catchAsync(async(req, res, next) => {
    const newBanner = await Banners.create(req.body);
    return res.status(201).send(newBanner);
});
exports.editBanner = catchAsync(async(req, res, next) => {
    const banner_id = req.params.id;
    const banner = await Banners.findOne({ where: { banner_id } });

    if (!banner)
        return next(new AppError('Banner did not found with that ID', 404));
    await banner.update(req.body)
    return res.status(200).send(banner)
})
exports.uploadBannerImageTm = catchAsync(async(req, res, next) => {
    const banner_id = req.params.id;
    const banner = await Banners.findOne({ where: { banner_id } });
    req.files = Object.values(req.files)
    if (!banner)
        return next(new AppError('Banner did not found with that ID', 404));
    const image_tm = `${banner_id}_banner-tm.webp`;
    const photo = req.files[0].data
    let buffer = await sharp(photo).webp().toBuffer()

    await sharp(buffer).toFile(`static/${image_tm}`);

    await banner.update({
        image_tm,
    });

    return res.status(201).send(banner);
});
exports.uploadBannerImageRu = catchAsync(async(req, res, next) => {
    const banner_id = req.params.id;
    const banner = await Banners.findOne({ where: { banner_id } });
    req.files = Object.values(req.files)
    if (!banner)
        return next(new AppError('Banner did not found with that ID', 404));
    const image_ru = `${banner_id}_banner-ru.webp`;
    const photo = req.files[0].data
    let buffer = await sharp(photo).webp().toBuffer()

    await sharp(buffer).toFile(`static/${image_ru}`);

    await banner.update({
        image_ru,
    });

    return res.status(201).send(banner);
});


exports.deleteBanner = catchAsync(async(req, res, next) => {
    const banner_id = req.params.id;
    const banner = await Banners.findOne({ where: { banner_id } });

    if (!banner)
        return next(new AppError('Banner did not found with that ID', 404));

    if (banner.image) {
        fs.unlink(`static/${banner.image}.webp`, function(err) {
            if (err) return next(new AppError(err, 500))
        });
    }

    await banner.destroy();

    return res.status(200).send('Successfully Deleted');
});