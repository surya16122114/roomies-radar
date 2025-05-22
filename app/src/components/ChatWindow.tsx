

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  TextField,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import SendIcon from "@mui/icons-material/Send";
import "../styles/ChatWindow.css";

interface Message {
  messageId: string;
  senderId: string;
  content: string;
  status: string;
  timestamp: string;
}

interface Chat {
  chatId: string;
  user1Id: string | null;
  user2Id: string | null;
  messages?: Message[];
}

interface ChatWindowProps {
  currentChat: Chat | null;
  messages: Message[];
  newMessage: string;
  setNewMessage: (value: string) => void;
  sendMessage: () => void;
  deleteMessage: (messageId: string) => void;
  updateMessageStatus: (chatId: string, messageId: string, status: string) => void; // Function to update status
  deletedMessageIds: string[];
  userId: string|null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  currentChat,
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  deleteMessage,
  updateMessageStatus,
  deletedMessageIds,
  userId,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [chatUserName, setChatUserName] = useState<string>("");

  // Fetch user details to display the name
  useEffect(() => {
    const fetchChatUserName = async () => {
      if (currentChat) {
        const otherUserId =
          currentChat.user1Id === userId ? currentChat.user2Id : currentChat.user1Id;

        if (otherUserId) {
          try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/profile/${otherUserId}`);
            const data = await response.json();
            if (data && data.profile) {
              setChatUserName(`${data.profile.userId.firstName} ${data.profile.userId.lastName}`);
            } else {
              setChatUserName("Unknown User");
            }
          } catch (error) {
            console.error("Error fetching user name:", error);
            setChatUserName("Unknown User");
          }
        }
      }
    };

    fetchChatUserName();
  }, [currentChat, userId]);

  // Update the message status to "read" when a chat is opened
  useEffect(() => {
    if (currentChat) {
      messages.forEach((message) => {
        if (message.status === "delivered" && message.senderId !== userId) {
          // Update the message status to "read"
          updateMessageStatus(currentChat.chatId, message.messageId, "read");
        }
      });
    }
  }, [currentChat, messages, updateMessageStatus, userId]);

  const handleArrowClick = (messageId: string) => {
    setSelectedMessageId(messageId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedMessageId) {
      deleteMessage(selectedMessageId);
    }
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
  };

  const formatDateLabel = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    ) {
      return "Today";
    } else if (
      date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate()
    ) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderDateLabel = (index: number): React.ReactNode => {
    if (index === 0) {
      return (
        <Typography className="chat-date-label">
          {formatDateLabel(new Date(messages[index].timestamp))}
        </Typography>
      );
    }

    const currentMessageDate = new Date(messages[index].timestamp);
    const previousMessageDate = new Date(messages[index - 1].timestamp);

    if (
      currentMessageDate.getDate() !== previousMessageDate.getDate() ||
      currentMessageDate.getMonth() !== previousMessageDate.getMonth() ||
      currentMessageDate.getFullYear() !== previousMessageDate.getFullYear()
    ) {
      return (
        <Typography className="chat-date-label">
          {formatDateLabel(currentMessageDate)}
        </Typography>
      );
    }

    return null;
  };

  return (
    <Box className="chat-window-container">
      {/* Chat Header */}
      <Paper elevation={1} className="chat-header">
        {currentChat ? (
          <>
            <Avatar className="chat-header-avatar">
              {chatUserName.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h6" className="chat-header-title">
              {chatUserName}
            </Typography>
          </>
        ) : (
          <Typography variant="h6" className="chat-header-title">
            No Chats Available
          </Typography>
        )}
      </Paper>

      {/* Chat Messages */}
      <Box className="chat-messages">
        {messages.map((message, index) => (
          <React.Fragment key={message.messageId}>
            {renderDateLabel(index)}
            <Box
              className={`chat-message ${
                message.senderId === userId ? "sent" : "received"
              }`}
            >
              <Paper
                elevation={2}
                className={`chat-message-bubble ${
                  deletedMessageIds.includes(message.messageId)
                    ? "deleted"
                    : message.senderId === userId
                    ? "sent"
                    : "received"
                }`}
                onMouseEnter={() => setHoveredMessageId(message.messageId)}
                onMouseLeave={() => setHoveredMessageId(null)}
              >
                <span className="chat-message-content-wrapper">
                  <span className="chat-message-content">
                    {deletedMessageIds.includes(message.messageId)
                      ? "This message has been deleted"
                      : message.content}
                  </span>
                  {message.senderId === userId && (
                    <div className="chat-message-meta">
                      <span className="message-timestamp">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span
                        className={`message-status-icon ${
                          message.status === "read" ? "read" : "delivered"
                        }`}
                      >
                        <DoneAllIcon className="tick-icon" />
                      </span>
                    </div>
                  )}
                </span>
                {message.senderId === userId &&
                  hoveredMessageId === message.messageId && (
                    <div className="chat-trash-icon-wrapper">
                      <IconButton
                        size="small"
                        className="chat-trash-icon"
                        onClick={() => handleArrowClick(message.messageId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  )}
              </Paper>
            </Box>
          </React.Fragment>
        ))}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-message-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this message?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Input Field */}
      {currentChat && (
        <Box className="chat-input-container">
          <TextField
            fullWidth
            multiline
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type your message..."
            className="chat-input-field"
          />
          <IconButton onClick={sendMessage} className="chat-send-button">
            <SendIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default ChatWindow;