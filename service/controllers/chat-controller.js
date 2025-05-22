import * as chatService from "../services/chat-service.js"; // Import chat service functions
import { setSuccess, setError } from "./response-handler.js"; // Import response handlers for success and error
import { io } from "../server.js"; // Import WebSocket instance for real-time updates

/**
 * Initiates or retrieves an existing chat between two users and notifies participants via WebSocket.
 *
 * @param {Object} request - The HTTP request object containing user1Id, user2Id, and postId.
 * @param {Object} response - The HTTP response object.
 */
export const initiateOrRetrieveChat = async (request, response) => {
    try {
        const { user1Id, user2Id } = request.body;

        if (!user1Id || !user2Id) {
            const error = new Error("user1Id and user2Id are required.");
            error.statusCode = 400;
            throw error;
        }

        const chat = await chatService.initiateOrRetrieveChat(user1Id, user2Id);

        // Notify participants about the initiated chat
        // io.to(user1Id).emit("chatInitiated", { chat });
        // io.to(user2Id).emit("chatInitiated", { chat });

        setSuccess(chat, response); // Send a success response with the chat details
    } catch (error) {
        setError(error, response); // Handle errors
    }
};


/**
 * Fetches all chats for a specific user.
 *
 * @param {Object} request - The HTTP request object.
 * @param {Object} response - The HTTP response object.
 */
export const getAllChats = async (request, response) => {
    try {
        const userId = request.params.userId;
        const chats = await chatService.getAllChats(userId);

        setSuccess(chats, response); // Send a success response with chat data
    } catch (error) {
        setError(error, response); // Handle errors
    }
};

/**
 * Sends a new message in a chat and notifies participants via WebSocket.
 *
 * @param {Object} request - The HTTP request object containing the chatId and message body.
 * @param {Object} response - The HTTP response object.
 */

export const sendMessage = async (request, response) => {
    try {
       
        const message = { ...request.body };
        const { chatId } = request.params;
        if (!message.content || !message.senderId) {
            const error = new Error("content, and senderId are required.");
            error.statusCode = 400;
            throw error;
        }

        const updatedChat = await chatService.sendMessage(chatId, message);

        // Notify participants in the chat about the new message
        io.to(chatId).emit("messageSent", { chatId, message });

        setSuccess(updatedChat, response); // Send a success response with the updated chat
    } catch (error) {
        setError(error, response); // Handle errors
    }
};


/**
 * Retrieves all messages from a specific chat.
 *
 * @param {Object} request - The HTTP request object.
 * @param {Object} response - The HTTP response object.
 */

export const getMessages = async (request, response) => {
    try {
        const { chatId } = request.params;
        const messages = await chatService.getMessages(chatId);

        setSuccess(messages, response); // Send a success response with message data
    } catch (error) {
        setError(error, response); // Handle errors
    }
};

/**
 * Updates the status of a message (e.g., "read", "delivered") and notifies participants via WebSocket.
 *
 * @param {Object} request - The HTTP request object containing the chatId, messageId, and new status.
 * @param {Object} response - The HTTP response object.
 */
export const updateMessageStatus = async (request, response) => {
    try {
        
        const { status } = request.body;
        const { chatId, messageId } = request.params;
        if (!status) {
            const error = new Error(" status is required.");
            error.statusCode = 400;
            throw error;
        }

        const updatedChat = await chatService.updateMessageStatus(chatId, messageId, status);

        // Notify participants in the chat about the status update
        io.to(chatId).emit("messageRead", { chatId, messageId, status });

        setSuccess(updatedChat, response); // Send a success response with the updated chat
    } catch (error) {
        setError(error, response); // Handle errors
    }
};


/**
 * Deletes a specific message from a chat and notifies participants via WebSocket.
 *
 * @param {Object} request - The HTTP request object containing the chatId and messageId.
 * @param {Object} response - The HTTP response object.
 */


export const deleteMessage = async (request, response) => {
    try {
        
        const { chatId, messageId } = request.params;
        if (!chatId || !messageId) {
            const error = new Error("messageId is required.");
            error.statusCode = 400;
            throw error;
        }

        const deletedMessage = await chatService.deleteMessage(chatId, messageId);

        // Notify participants in the chat about the message deletion
        io.to(chatId).emit("messageDeleted", { chatId, messageId });

        setSuccess({ message: "Message deleted successfully", deletedMessage }, response); // Send a success response with the updated chat
    } catch (error) {
        setError(error, response); // Handle errors
    }
};

/**
 * Deletes a chat by its ID and notifies participants via WebSocket.
 *
 * @param {Object} request - The HTTP request object containing the chatId.
 * @param {Object} response - The HTTP response object.
 */

export const deleteChat = async (request, response) => {
    try {
      const { chatId } = request.params;
  
      const deletedChat = await chatService.deleteChat(chatId);
  
      if (!deletedChat) {
        const error = new Error("Chat not found.");
        error.statusCode = 404;
        throw error;
      }
  
      io.to(chatId).emit("chatDeleted", { chatId });
  
      setSuccess({ message: "Chat deleted successfully", deletedChat }, response);
    } catch (error) {
      setError(error, response);
    }
  };



export const searchUsers = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name || typeof name !== "string" || !name.trim()) {
            const error = new Error("Name parameter is required and must be a non-empty string.");
            error.statusCode = 400;
            throw error;
        }

        const users = await chatService.searchUsersByName(name);

        if (!users.length) {
            const error = new Error("No users found with the given name.");
            error.statusCode = 404;
            throw error;
        }

        setSuccess(users, res); // Send a success response with the users
    } catch (error) {
        setError(error, res); // Handle errors
    }
};