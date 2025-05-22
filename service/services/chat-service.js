import Chat from "../models/chat.js"; // Import the Chat model
import mongoose from "mongoose"; // Import Mongoose for MongoDB operations
import { User } from "../models/UserModel.js"; // Use the named import // Import the User model


/**
 * Initiates or retrieves an existing chat between two users.
 *
 * @param {string} user1Id - The ID of the first user (passed as a string).
 * @param {string} user2Id - The ID of the second user (passed as a string).
 * @returns {Object} - The existing or newly created chat document.
 */
export const initiateOrRetrieveChat = async (user1Id, user2Id) => {
    // Convert string user IDs to ObjectId for database queries
    const user1ObjectId =new mongoose.Types.ObjectId(user1Id);
    const user2ObjectId = new mongoose.Types.ObjectId(user2Id);

    // Validate user1Id
    const user1 = await User.findById(user1ObjectId);
    if (!user1) {
        throw new Error(`User with ID ${user1Id} not found.`);
    }

    // Validate user2Id
    const user2 = await User.findById(user2ObjectId);
    if (!user2) {
        throw new Error(`User with ID ${user2Id} not found.`);
    }

    // Check if a chat already exists between the two users
    let chat = await Chat.findOne({ user1Id: user1ObjectId, user2Id: user2ObjectId });
    if (!chat) {
        // Create a new chat if none exists
        chat = new Chat({
            chatId: new mongoose.Types.ObjectId().toString(), // Generate a unique chatId
            user1Id: user1ObjectId, // Store ObjectId
            user2Id: user2ObjectId, // Store ObjectId
        });
        await chat.save(); // Save the new chat to the database
    }

    return chat; // Return the existing or newly created chat
};


/**
 * Retrieves all chats for a specific user after validating the user exists.
 * 
 * @param {string} userId - The ID of the user (passed as a string).
 * @returns {Array} - A list of chat documents where the user is a participant.
 * @throws {Error} - If the user does not exist.
 */
export const getAllChats = async (userId) => {
    // Convert userId string to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Validate the user exists in the User schema
    const user = await User.findById(userObjectId);
    if (!user) {
        throw new Error(`User with ID ${userId} not found.`);
    }

    // Find chats where the user is either user1Id or user2Id
    return Chat.find({ $or: [{ user1Id: userObjectId }, { user2Id: userObjectId }] });
};


export const sendMessage = async (chatId, { content, senderId }) => {
    // Validate senderId format
    if (!mongoose.isValidObjectId(senderId)) {
        throw new Error("Invalid sender ID format. Must be a valid ObjectId string.");
    }

    // Validate chatId format
    if (!mongoose.isValidObjectId(chatId)) {
        throw new Error("Invalid chat ID format. Must be a valid ObjectId string.");
    }

    // Convert senderId to ObjectId
    const senderObjectId = new mongoose.Types.ObjectId(senderId);

    // Check if the sender exists
    const sender = await User.findById(senderObjectId);
    if (!sender) {
        throw new Error(`Sender with ID ${senderId} not found.`);
    }

    // Check if the chat exists
    const chat = await Chat.findOne({ chatId }); // Updated to use findById for clarity
    if (!chat) {
        throw new Error(`Chat with ID ${chatId} not found.`);
    }

    // Create a new message
    chat.messages.push({
        messageId: new mongoose.Types.ObjectId().toString(), // Unique messageId
        senderId: senderObjectId, // Sender's ObjectId
        content,
        status: "delivered", // Default status
        timestamp: new Date(), // Current timestamp
    });
        // Add the new message to the chat


    // Update the lastUpdated timestamp
    chat.lastUpdated = new Date();

    // Save the updated chat
    await chat.save();

    // Return only the messages array
    return chat.messages;

};

/**
 * Retrieves all messages from a specific chat.
 * 
 * @param {string} chatId - The unique identifier for the chat.
 * @returns {Array} - An array of messages if the chat exists; otherwise, an empty array.
 */
export const getMessages = async (chatId) => {
    const chat = await Chat.findOne({ chatId });
    return chat ? chat.messages : [];
};

/**
 * Updates the status of a specific message in a chat.
 * 
 * @param {string} chatId - The unique identifier for the chat.
 * @param {string} messageId - The unique identifier for the message.
 * @param {string} status - The new status of the message (e.g., "delivered", "read").
 * @returns {Object} - The updated chat document after saving the new message status.
 * @throws {Error} - If the chat or message is not found, an error will be thrown.
 */
export const updateMessageStatus = async (chatId, messageId, status) => {
    const chat = await Chat.findOne({ chatId });
    if (!chat) throw new Error("Chat not found");

    // Find the specific message by messageId
    const message = chat.messages.find((msg) => msg.messageId === messageId);
    if (!message) throw new Error("Message not found");

    // Update the status of the message
    message.status = status;
    await chat.save(); 
    // Save and return the updated message
    return message;
};

/**
 * Deletes a chat by its ID.
 * 
 * @param {string} chatId - The unique identifier for the chat to delete.
 * @returns {Object} - The deleted chat document.
 * @throws {Error} - If the chat is not found, an error will be thrown.
 */
export const deleteChat = async (chatId) => {
    const deletedChat = await Chat.findOneAndDelete({ chatId }); // Find and delete the chat
    if (!deletedChat) throw new Error("Chat not found");
    return deletedChat; // Return the deleted chat
};

/**
 * Deletes a specific message from a chat.
 * 
 * @param {string} chatId - The unique identifier for the chat.
 * @param {string} messageId - The unique identifier for the message to delete.
 * @returns {Object} - The deleted message object.
 * @throws {Error} - If the chat or message is not found, an error will be thrown.
 */
export const deleteMessage = async (chatId, messageId) => {
    const chat = await Chat.findOne({ chatId });
    if (!chat) throw new Error("Chat not found");

    // Find the message index to delete
    const messageIndex = chat.messages.findIndex((msg) => msg.messageId === messageId);
    if (messageIndex === -1) throw new Error("Message not found");

    // Extract and remove the message from the array
    const [deletedMessage] = chat.messages.splice(messageIndex, 1);

    // Update the lastUpdated timestamp
    chat.lastUpdated = new Date();

    // Save and return the deleted message
    await chat.save();
    return deletedMessage;
};


export const searchUsersByName = async (name) => {
    try {
        const query = {
            $or: [
                { firstName: { $regex: name, $options: "i" } },
                { lastName: { $regex: name, $options: "i" } },
            ],
        };

   
        const users = await User.find(query).select("_id firstName lastName").lean();

        return users.map((user) => ({
            userId: user._id.toString(),
            name: `${user.firstName} ${user.lastName}`,
        }));
    } catch (error) {
       
        throw error;
    }
};