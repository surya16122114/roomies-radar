import mongoose from "mongoose";

// Schema for individual messages in a chat
const messageSchema = new mongoose.Schema({
    messageId: { type: String, required: true }, // Unique message ID
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Refers to User collection
    content: { type: String, required: true }, // Message content
    status: { type: String, enum: ["delivered", "read"], default: "delivered" }, // Message status
    timestamp: { type: Date, default: Date.now }, // Message timestamp
});



const chatSchema = new mongoose.Schema({
    chatId: { type: String, required: true }, // Unique chat ID
    user1Id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Refers to User collection
    user2Id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Refers to User collection
    messages: [messageSchema],
    createdAt: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
});

const ChatModel = mongoose.model("Chat", chatSchema);
export default ChatModel;
