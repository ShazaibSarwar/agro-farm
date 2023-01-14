const catchAsync = require("../utils/catchAsync");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
/**
 * @desc    Get Send messages
 * @route   GET /api/v1/messages
 * @access  Public
 * @type {(function(*, *, *): void)|*}
 */
exports.sendMessage = catchAsync(async (req, res, next) => {
    console.log("--------------------------------- In Send Message Controller ---------------------------------");
    const {chatId, content} = req.body;
    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }
    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };
    try {
        let message = await Message.create(newMessage);
        message = await message.populate("sender", "firstName lastname email experience price CNIC").execPopulate();
        message = await message.populate("chat").execPopulate();
        message = await User.populate(message, {
            path: "chat.users",
            select: "firstName lastname email experience price CNIC",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {latestMessage: message});
        res.status(201).json({
            status: "success",
            data: {
                message: message,
            },
        });

    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
});

/**
 * @desc    Get all messages
 * @route   GET /api/messages/:chatId
 * @access  Private
 */
exports.allMessages = catchAsync(async (req, res, next) => {
    console.log("--------------------------------- In All Messages Controller ---------------------------------");
    try {
        const messages = await Message.find({chat: req.params.chatId})
            .populate("sender", "firstName lastname email experience price CNIC")
            .populate("chat");
        res.json(messages);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
});
/**
 * @desc    Send messages
 * @route   POST /api/v1/message/upload
 * @access  Private
 */

exports.uploadFile = catchAsync(async (io, socket) => {
    socket.on('upload', async (file) => {
        const {chatId, content} = file;

        if (!content || !chatId) {
            console.log("Invalid data passed into request");
            return socket.emit('message', {error: "Invalid data passed into request"});
        }

        // Decode the base64 string into a Buffer object
        const buffer = new Buffer(file.data, 'base64');

        // Create a new message with the buffer as a binary field
        const newMessage = {
            sender: file.sender,
            content: content,
            chat: chatId,
            file: buffer
        };

        try {
            // Save the message to the database
            let message = await Message.create(newMessage);

            // Populate the message with the sender, chat, and chat users data
            message = await message.populate("sender", "firstName lastname email experience price CNIC").execPopulate();
            message = await message.populate("chat").execPopulate();
            message = await User.populate(message, {
                path: "chat.users",
                select: "firstName lastname email experience price CNIC",
            });

            // Update the chat with the latest message
            await Chat.findByIdAndUpdate(chatId, {latestMessage: message});

            // Emit the message to the client
            socket.emit('message', message);
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
});