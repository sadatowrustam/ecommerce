module.exports = (io) => {
    const { Chat } = require("../models")
    let users = {}
    let adminOnline = false
    let adminSocket
    let isNewMessage = false
    const express = require("express");
    const router = express.Router()
    io.on('connection', async(socket) => {
        socket.on('new-user', async(name) => {

            await Chat.create({ user: socket.id })
            users[socket.id] = socket.id
            socket.emit("new-user-login", { id: socket.id })
        })
        socket.on("login", async(socketId) => {
            users[socket.id] = socket.id
            let messages = await Chat.findOne({ where: { user: socketId } })
            await Chat.update({ lastId: socket.id }, { where: { user: socketId } })
            socket.emit("all-messages", { messages: messages.chat })
        })
        socket.on("admin-login", async() => {
            adminOnline = true
            adminSocket = socket.id
            if (isNewMessage) {
                socket.emit("new-messages")
                isNewMessage = false
            }
        })
        socket.on("admin-send", async(message) => {
            let chat_id = message.chat_id
            let lastMessage = message.text
            let messages = await Chat.findOne({ where: { chat_id } })
            if (users[messages.lastId] != undefined) {
                socket.broadcast.to(messages.lastId).emit('admin-message', { lastMessage })
            }
            let allMessages = messages.chat
            let newMessage = {
                who: "admin",
                message: lastMessage
            }
            allMessages.push(newMessage)
            await Chat.update({ chat: allMessages }, { where: { chat_id } })
            socket.emit("admin-success", {})
        })
        socket.on('send-chat-message', async(obj) => {
            let allMessages = []
            let messages = await Chat.findOne({ where: { user: obj.id } })
            obj.id = messages.id

            if (messages.chat != null) {
                allMessages = messages.chat
            }
            let newMessage = {
                who: "you",
                message: obj.message
            }
            allMessages.push(newMessage)
            if (adminOnline) {
                socket.broadcast.emit("chat-message", obj)
                isNewMessage = false
            }
            await Chat.update({ chat: allMessages, lastId: socket.id, isRead: "false" }, { where: { id: obj.id } })


        })
        socket.on('disconnect', () => {
            if (adminSocket == socket.id) {
                adminOnline = false
            }
            delete users[socket.id]
        })
    })
    return router
}