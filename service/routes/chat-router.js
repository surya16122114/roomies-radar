import express from "express";
import * as chatController from "../controllers/chat-controller.js"; // Importing chat controller functions

const router = express.Router(); // Creating an Express router instance

// Route to search for users by name
router.get("/search", chatController.searchUsers);

// Route to fetch all chats for a specific user

router.get("/:userId", chatController.getAllChats);

// Route to retrieve all messages in a specific chat
router.get("/:chatId/messages", chatController.getMessages);

// Route to send a new message in a specific chat
router.post("/:chatId/messages", chatController.sendMessage);

// Route to update the status (e.g., delivered, read) of a specific message
router.put("/:chatId/messages/:messageId/messageStatus", chatController.updateMessageStatus);

// Route to delete an entire chat
router.delete("/:chatId", chatController.deleteChat);

// Route to delete a specific message in a chat
router.delete("/:chatId/messages/:messageId", chatController.deleteMessage);

// Route to initiate or retrieve an existing chat between two users
router.post("/", chatController.initiateOrRetrieveChat);

export default router; 
