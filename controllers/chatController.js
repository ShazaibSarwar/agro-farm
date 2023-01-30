const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
/**
 * @desc    Get all chats
 * @route   GET /api/v1/chats
 * @access  Private
 */
exports.createChatForUsers = catchAsync(async (req, res, next) => {

    const {id} = req.body;
    console.log('id --->', id);

    if (!id) {
        console.log('id param not sent with request');
        return next(new AppError("No user found", 404));
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {users: {$elemMatch: {$eq: id}}},
            {users: {$elemMatch: {$eq: req.user._id}}}
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "firstName lastname email experience price CNIC",
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, id],
        };
        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({_id: createdChat._id}).populate(
                "users",
                "-password"
            );
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

/**
 * @desc    Get all chats
 * @route   GET /api/v1/chats
 * @access  Private
 */
exports.fetchAllChatsOfLoggedInUser = catchAsync(async (req, res, next) => {
    try {
        Chat.find({users: {$elemMatch: {$eq: req.user._id}}})
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({updatedAt: -1})
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "firstName lastname email experience price CNIC",
                });
                res.status(200).json(results);
            });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});