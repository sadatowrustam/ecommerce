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
            console.log("new users")
            await Chat.create({ user: socket.id })
            users[socket.id] = socket.id
            socket.emit("new-user-login", { id: socket.id })
        })
        socket.on("login", async(socketId) => {
            console.log("login")
            users[socket.id] = socket.id
            console.log(socketId)
            let messages = await Chat.findOne({ where: { user: socketId } })
            await Chat.update({ lastId: socket.id }, { where: { user: socketId } })
            socket.emit("all-messages", { messages: messages.chat })
        })
        socket.on("admin-login", async() => {
            adminOnline = true
            adminSocket = socket.id
            console.log(isNewMessage)
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
            console.log("admin has send message")
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
            console.log(newMessage)
            allMessages.push(newMessage)
            if (adminOnline) {
                socket.emit('chat-message', { message: obj })
                isNewMessage = false
            }
            await Chat.update({ chat: allMessages, lastId: socket.id, isRead: "false" }, { where: { id: obj.id } })


        })
        socket.on('disconnect', () => {
            console.log("chykdy")
            if (adminSocket == socket.id) {
                console.log("admin chykdy")
                adminOnline = false
            }
            delete users[socket.id]
        })
    })
    return router
}