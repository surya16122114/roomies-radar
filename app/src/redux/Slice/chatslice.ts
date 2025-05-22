// chatSlice.ts (no changes for updateMessage)
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Chat {
  chatId: string;
  user1Id: string|null;
  user2Id: string|null;
  messages?: { messageId: string; senderId: string; content: string; status: string; timestamp: string }[];
}

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: { messageId: string; senderId: string; content: string; status: string; timestamp: string }[];
  deletedMessageIds: string[];
  newMessage: string;
}

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  messages: [],
  deletedMessageIds: [],
  newMessage: "",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    setCurrentChat: (state, action: PayloadAction<Chat | null>) => {
      state.currentChat = action.payload;
    },
    setMessages: (state, action: PayloadAction<{ messageId: string; senderId: string; content: string; status: string; timestamp: string }[]>) => {
      state.messages = action.payload;
    },
    setNewMessage: (state, action: PayloadAction<string>) => {
      state.newMessage = action.payload;
    },
    addDeletedMessage: (state, action: PayloadAction<string>) => {
      state.deletedMessageIds.push(action.payload);
    },
  },
});

export const { setChats, setCurrentChat, setMessages, setNewMessage, addDeletedMessage } = chatSlice.actions;

export default chatSlice.reducer;
