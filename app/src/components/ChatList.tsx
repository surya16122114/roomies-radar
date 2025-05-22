
import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  IconButton,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  Button,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import "../styles/ChatList.css";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import UserSearchBar from "./usersearchbar";

interface Chat {
  chatId: string;
  user1Id: string | null;
  user2Id: string | null;
  messages?: {
    messageId: string;
    senderId: string;
    content: string;
    status: string;
    timestamp: string;
  }[];
}

interface ChatListProps {
  chats: Chat[];
  currentChat: Chat | null;
  setCurrentChat: (chat: Chat) => void;
  fetchMessages: (chatId: string) => void;
  deleteChat: (chatId: string) => void; // Function to delete chat
  userId: string|null;
  initiateOrRetrieveChat:(user1Id:string|null, user2Id: string|null)=> void;
  preFetchedNames?: Record<string, string>;
 
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  currentChat,
  setCurrentChat,
  fetchMessages,
  deleteChat,
  initiateOrRetrieveChat,
  userId,
  preFetchedNames = {},
}) => {
  const [userNames, setUserNames] = useState<Record<string, string>>(preFetchedNames); 
  const [loadingUserNames, setLoadingUserNames] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);
const { t } = useTranslation();

const handleDeleteClick = (chat: Chat) => {
    setChatToDelete(chat);
    setIsDeleteDialogOpen(true);
};

const handleDeleteConfirm = () => {
    if (chatToDelete) {
        deleteChat(chatToDelete.chatId); // Call the deleteChat function
        setChatToDelete(null);
    }
    setIsDeleteDialogOpen(false);
};

const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setChatToDelete(null);
};


// Initialize with pre-fetched names


    useEffect(() => {
        const fetchUserNames = async () => {
            setLoadingUserNames(true);

            try {
                const uniqueUserIds = new Set<string>();
                chats.forEach((chat) => {
                    if (chat.user1Id && chat.user1Id !== userId) uniqueUserIds.add(chat.user1Id);
                    if (chat.user2Id && chat.user2Id !== userId) uniqueUserIds.add(chat.user2Id);
                });

                const fetchedNames: Record<string, string> = {};

                for (const id of uniqueUserIds) {
                    if (!userNames[id]) { // Fetch only if the name is missing
                        const response = await fetch(`${process.env.REACT_APP_API_URL}/profile/${id}`);
                        const data = await response.json();
                        if (data?.profile) {
                            fetchedNames[id] = `${data.profile.userId.firstName} ${data.profile.userId.lastName}`;
                        }
                    }
                }

                setUserNames((prev) => ({ ...prev, ...fetchedNames }));
            } catch (error) {
                console.error("Error fetching user names:", error);
            }

            setLoadingUserNames(false);
        };

        fetchUserNames();
    }, [chats, userId]);




  const getDisplayName = (userId: string | null) => {
    if (!userId) return "Unknown User";
    return userNames[userId] || "Loading...";
  };
  
  
  
  return (
    <Box className="chat-list-container">
      {/* Search Bar */}
     


      {/* Chat list header */}
      <Typography variant="h6" className="chat-list-header">
        {t('inbox')}
      </Typography>

      <UserSearchBar 
    userId={userId} 
    initiateOrRetrieveChat={initiateOrRetrieveChat} 
/>

      <List className="chat-list">
        {loadingUserNames && <CircularProgress />}
        {chats.map((chat) => (
          <ListItem
            key={chat.chatId}
            onClick={() => {
              setCurrentChat(chat); // Set active chat
              fetchMessages(chat.chatId); // Fetch messages for chat
            }}
            className={`chat-list-item ${
              currentChat?.chatId === chat.chatId ? "active" : "" // Highlight active chat
            }`}
          >
            {/* Display avatar */}
            <ListItemAvatar>
              <Avatar className="chat-avatar">
                {getDisplayName(chat.user1Id === userId ? chat.user2Id : chat.user1Id)
                  ?.charAt(0)
                  .toUpperCase()}
              </Avatar>
            </ListItemAvatar>

            {/* Chat participant and last message */}
            <ListItemText
    primary={
        <Typography className="chat-primary-text">
            {getDisplayName(chat.user1Id === userId ? chat.user2Id : chat.user1Id)}
        </Typography>
    }
    secondary={
        <Typography className="chat-secondary-text">
            {chat.messages?.[chat.messages.length - 1]?.content || "No messages yet"}
        </Typography>
    }
/>


            {/* Trash icon */}
            <IconButton
    className="chat-delete-icon"
    onClick={(e) => {
        e.stopPropagation(); // Prevent triggering chat selection
        handleDeleteClick(chat); // Open the delete confirmation dialog
    }}
>
    <DeleteIcon />
</IconButton>
          </ListItem>
        ))}
      </List>
      <Dialog
    open={isDeleteDialogOpen}
    onClose={handleDeleteCancel}
    aria-labelledby="delete-chat-dialog-title"
>
    <DialogContent>
        <DialogContentText>
            {t('deleteChatConfirmation')}
        </DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button onClick={handleDeleteCancel} color="primary">
            {t('cancel')}
        </Button>
        <Button onClick={handleDeleteConfirm} color="error">
            {t('delete')}
        </Button>
    </DialogActions>
</Dialog>

    </Box>
  );
};

export default ChatList;