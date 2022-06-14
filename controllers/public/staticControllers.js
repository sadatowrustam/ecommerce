const { Static } = require('../../models');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

exports.getStatic = catchAsync(async(req, res, next) => {
    const static = await Static.findOne({
        where: { id: req.params.id },
    });
    return res.status(200).send(static)
})