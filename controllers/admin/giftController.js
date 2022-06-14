const { Gifts } = require("../../models")
const { Op } = require('sequelize');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const sharp = require('sharp')
const fs = require("fs")
exports.addGift = catchAsync(async(req, res, next) => {
    const gift = await Gifts.create(req.body)
    return res.status(201).send(gift)
})
exports.editGift = catchAsync(async(req, res, next) => {
    const gift_id = req.params.id
    const gift = await Gifts.findOne({ where: { gift_id } })
    gift.update(req.body)
    return res.status(200).send(gift)
})
exports.allGifts = catchAsync(async(req, res, next) => {
    const limit = req.query.limit || 20
    const offset = req.query.offset
    const gifts = await Gifts.findAndCountAll({
        order: [
            ["id", "DESC"]
        ],
        limit,
        offset
    })
    return res.status(200).send(gifts)
})
exports.oneGift = catchAsync(async(req, res, next) => {
    const gift_id = req.params.id
    const gift = await Gifts.findOne({ where: { gift_id } })
    return res.status(200).send(gift)
})
exports.uploadImage = catchAsync(async(req, res, next) => {
    const gift_id = req.params.id
    const gift = await Gifts.findOne({ where: { gift_id } })
    req.files = Object.values(req.files)
    const image = gift_id + "_gift.webp"
    const photo = req.files[0].data
    const buffer = await sharp(photo).webp().toBuffer()
    await sharp(buffer).toFile(`static/${image}`)
    await gift.update({ image })
    return res.status(200).send(gift)
})
exports.deleteGift = catchAsync(async(req, res, next) => {
    const gift_id = req.params.id
    const gift = await Gifts.findOne({ where: { gift_id } })
    if (gift.image) {
        fs.unlink(`static/${gift.image}`, (err) => {
            if (err) throw new Error("image not found")
        })
    }
    await gift.destroy()
    return res.status(200).send({ msg: "Sucessfully deleted" })
})