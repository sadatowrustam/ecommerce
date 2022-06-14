const { Texts } = require("../../models")
const AppError = require("../../utils/appError")
const catchAsync = require("../../utils/catchAsync")

exports.get_text = catchAsync(async(req, res, next) => {
    const text = await Texts.findOne({ where: { text_id: req.params.id } })
    if (!text) return next(new AppError("Text with that id not found", 404))
    return res.status(200).send(text)
})