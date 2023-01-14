const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const messageController = require("../controllers/messageController");

router.route("/").post(authController.protect, messageController.sendMessage); // POST /api/v1/message
router.route("/:chatId").get(authController.protect, messageController.allMessages); // GET /api/v1/message
router.route("/upload").post(authController.protect, messageController.uploadFile); // POST /api/v1/message/upload
module.exports = router;