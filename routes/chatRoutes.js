const express = require("express");
const authController = require("../controllers/authController");
const chatController = require("../controllers/chatController");
const router = express.Router();

router.route("/").post(authController.protect, chatController.createChatForUsers); // POST /api/v1/chat
router.route("/").get(authController.protect, chatController.fetchAllChatsOfLoggedInUser); // GET /api/v1/chat

module.exports = router;