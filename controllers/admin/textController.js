const { Texts } = require("../../models")
const catchAsync = require("../../utils/catchAsync")
const AppError = require("../../utils/appError")
const { v4 } = require("uuid")

exports.allTexts = catchAsync(async(req, res, next) => {
    const limit = req.query.limit || 20
    const offset = req.query.offset
    const texts = await Texts.findAndCountAll({
        order: [
            ["id", "DESC"]
        ],
        limit,
        offset
    })
    return res.status(200).send(texts)
})
exports.createText = catchAsync(async(req, res, next) => {
    const text_id = v4()
    req.body.text_id = text_id
    req.body.link = "/banner/" + text_id
    let text = await Texts.create(req.body)
    return res.status(201).send(text)
})
exports.editText = catchAsync(async(req, res, next) => {
    const text = await Texts.findOne({ where: { text_id: req.params.id } })
    if (!text) return next(new AppError("Text with that id not found", 404))
    await text.update(req.body)
    return res.status(200).send(text)
})
exports.deleteText = catchAsync(async(req, res, next) => {
    const text = await Texts.findOne({ where: { text_id: req.params.id } })
    if (!text) return next(new AppError("Text with that id not found", 404))
    await text.destroy()
    return res.status(200).send({ msg: "Sucess" })
})