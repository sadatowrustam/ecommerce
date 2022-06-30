const { Op } = require('sequelize');
const { Chat } = require('../../models');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
exports.getAllChats = catchAsync(async(req, res, next) => {
    let chat = await Chat.findAll({
        order: [
            ["updatedAt", "DESC"]
        ],
        where: {
            chat: {
                [Op.not]: null
            }
        }
    })
    return res.status(200).send(chat)
})
exports.getOneChat = catchAsync(async(req, res, next) => {
    let chat_id = req.params.id
    let chat = await Chat.findOne({ where: { chat_id } })
    if (!chat) return next(new AppError("Chat with that id not found"))
    await Chat.update({ isRead: "true" }, { where: { chat_id } })
    return res.send(chat)
})