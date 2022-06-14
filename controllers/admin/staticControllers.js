const { Static } = require('../../models');

const catchAsync = require('../../utils/catchAsync');

exports.editStatic = catchAsync(async(req, res, next) => {
    const static = await Static.findOne({
        where: { id: req.params.id },
    });
    await static.update(req.body)
    return res.status(200).send(static)
})