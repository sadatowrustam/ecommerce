const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const { Banners, Products } = require('../../models');

exports.getAllBanners = catchAsync(async(req, res) => {
    const limit = req.query.limit || 20;
    const offset = req.query.offset;

    const banners = await Banners.findAndCountAll({
        order: [
            ['updatedAt', 'DESC']
        ],
        limit,
        offset,
    });

    return res.status(200).send({ banners });
});

exports.getBanner = catchAsync(async(req, res, next) => {
    const banner = await Banners.findOne({
        where: { banner_id: req.params.id },
    });

    if (!banner)
        return next(new AppError('Banner did not found with that ID', 404));

    return res.status(200).send({ banner });
});