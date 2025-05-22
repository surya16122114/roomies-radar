import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import { io } from "socket.io-client";
import { setChats, setCurrentChat, setMessages, setNewMessage, addDeletedMessage } from "../redux/Slice/chatslice";
import ChatList from "../components/chatlist";
import ChatWindow from "../components/chatwindow";
import HpNavbar from "../components/hpnavabar";
import "../styles/ChatPage.css";
import { AppDispatch, RootState } from "../redux/store";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";



const socket = io(process.env.REACT_APP_API_URL);

const ChatPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { chats, currentChat, messages, deletedMessageIds, newMessage } = useSelector((state: any) => state.chat);

  const user = useSelector((state: RootState) => state.user);
  const userId=user.id;
  const navigate = useNavigate();

  const location = useLocation();
  const newChatFromState = location.state?.newChat; // Extract new chat
  const preFetchedNames = location.state?.preFetchedNames || {}; // Extract pre-fetched names

  
  useEffect(() => {
    const fetchChats = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/chats/${userId}`);
            const result = await response.json();

            if (result.success) {
                let updatedChats = [...result.data];

                if (newChatFromState) {
                    const existingChat = updatedChats.find(
                        (chat) => chat.chatId === newChatFromState.chatId
                    );

                    if (!existingChat) {
                        updatedChats.unshift(newChatFromState); // Add new chat at the top
                    } else {
                        // Move the existing chat to the top
                        updatedChats = [
                            existingChat,
                            ...updatedChats.filter((chat) => chat.chatId !== existingChat.chatId),
                        ];
                    }
                }

                dispatch(setChats(updatedChats));

                if (newChatFromState) {
                    dispatch(setCurrentChat(newChatFromState));
                    fetchMessages(newChatFromState.chatId);
                } else if (updatedChats.length > 0) {
                    dispatch(setCurrentChat(updatedChats[0]));
                    fetchMessages(updatedChats[0].chatId);
                }
            }
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    };

    fetchChats();
}, [userId, newChatFromState, dispatch]);



  useEffect(() => {
    if (currentChat) {
      socket.emit("joinChat", currentChat.chatId);

      socket.on("messageSent", (data) => {
        if (data.chatId === currentChat.chatId) {
          dispatch(setMessages([...messages, data.message]));
        }
      });

      socket.on("messageRead", ({ messageId, status }) => {
        dispatch(setMessages(messages.map((msg:any) =>
          msg.messageId === messageId ? { ...msg, status } : msg
        )));
      });

      socket.on("messageDeleted", ({ messageId }) => {
        dispatch(setMessages(messages.filter((msg:any) => msg.messageId !== messageId)));
      });

      socket.on("chatDeleted", ({ chatId }) => {
        dispatch(setChats(chats.filter((chat:any) => chat.chatId !== chatId)));
        if (currentChat?.chatId === chatId) {
          dispatch(setCurrentChat(null));
          dispatch(setMessages([]));
        }
      });

      return () => {
        socket.off("messageSent");
        socket.off("messageRead");
        socket.off("messageDeleted");
        socket.off("chatDeleted");
      };
    }
  }, [currentChat, dispatch, messages, chats]);

  const fetchMessages = async (chatId: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/chats/${chatId}/messages`);
      const result = await response.json();
      if (result.success) {
        dispatch(setMessages(result.data));
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const message = { content: newMessage, senderId: userId, status: "delivered" };
      const response = await fetch(`${process.env.REACT_APP_API_URL}/chats/${currentChat?.chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });
      const result = await response.json();
      if (result.success) {
        dispatch(setMessages(result.data));
        dispatch(setNewMessage(""));
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const updateMessageStatus = (chatId: string, messageId: string, status: string) => {
    try {
      // Dispatch to update the message status in Redux
      dispatch(setMessages(
        messages.map((msg:any) => 
          msg.messageId === messageId ? { ...msg, status } : msg
        )
      ));
  
      // Call the backend to persist the update
      fetch(`${process.env.REACT_APP_API_URL}/chats/${chatId}/messages/${messageId}/messageStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          console.log(`Message ${messageId} status updated to ${status}`);
        }
      })
      .catch((error) => {
        console.error("Error updating message status on the server:", error);
      });
  
    } catch (error) {
      console.error("Error updating message status:", error);
    }
  };
  

  const initiateOrRetrieveChat = async (user1Id: string|null, user2Id: string|null) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/chats`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user1Id, user2Id }),
        });

        const data = await response.json();
        if (data.success) {
            const newChat = data.data;

            // Check if the chat already exists
            const chatExists = chats.find((chat:any) => chat.chatId === newChat.chatId);
            if (!chatExists) {
                dispatch(setChats([...chats, newChat])); // Update chat list
            }

            // Set the new chat as the current chat
            dispatch(setCurrentChat(newChat));
            fetchMessages(newChat.chatId); // Fetch messages for the new chat
        } else {
            console.error("Failed to initiate or retrieve chat:", data.message);
        }
    } catch (error) {
        console.error("Error initiating or retrieving chat:", error);
    }
};


  

const deleteMessage = async (messageId: string) => {
  try {
      const response = await fetch(
          `${process.env.REACT_APP_API_URL}/chats/${currentChat?.chatId}/messages/${messageId}`,
          { method: "DELETE" }
      );
      const result = await response.json();

      if (result.success) {
          dispatch(
              setMessages(messages.filter((msg:any) => msg.messageId !== messageId))
          ); // Update messages in the chat window

          // Update the last message in the chats list
          const updatedChats = chats.map((chat:any) => {
              if (chat.chatId === currentChat?.chatId) {
                  const updatedMessages = messages.filter(
                      (msg:any) => msg.messageId !== messageId
                  );
                  const lastMessage = updatedMessages[updatedMessages.length - 1];
                  return { ...chat, messages: updatedMessages.length ? [lastMessage] : [] };
              }
              return chat;
          });
          dispatch(setChats(updatedChats)); // Update chats state
      }
  } catch (error) {
      console.error("Error deleting message:", error);
  }
};


  const deleteChat = async (chatId: string) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/chats/${chatId}`, {
            method: "DELETE",
        });
        const result = await response.json();

        if (result.success) {
            const updatedChats = chats.filter((chat:any) => chat.chatId !== chatId);
            dispatch(setChats(updatedChats));

            // Navigate to the previous chat or first chat if available
            if (updatedChats.length > 0) {
                const chatIndex = chats.findIndex((chat:any) => chat.chatId === chatId);
                const newCurrentChat =
                    updatedChats[chatIndex - 1] || updatedChats[0];
                dispatch(setCurrentChat(newCurrentChat));
                fetchMessages(newCurrentChat.chatId);
            } else {
                // If no chats are left, clear the current chat and messages
                dispatch(setCurrentChat(null));
                dispatch(setMessages([]));
            }
        }
    } catch (error) {
        console.error("Error deleting chat:", error);
    }
};




  return (
    <>
      <HpNavbar />
      <Box className="page-container">
      <Box className="chat-page">
        <ChatList
          chats={chats}
          currentChat={currentChat}
          setCurrentChat={(chat) => dispatch(setCurrentChat(chat))}
          fetchMessages={fetchMessages}
          deleteChat={deleteChat} // Pass the deleteChat function
          userId={userId}
          initiateOrRetrieveChat={initiateOrRetrieveChat}
          preFetchedNames={preFetchedNames}
         
        />
        <ChatWindow
          currentChat={currentChat}
          messages={messages}
          newMessage={newMessage}
          setNewMessage={(value) => dispatch(setNewMessage(value))}
          sendMessage={sendMessage}
          updateMessageStatus={updateMessageStatus} // Pass the updateMessage function
          deleteMessage={deleteMessage}
          deletedMessageIds={deletedMessageIds}
          userId={userId}
        />
      </Box>
      </Box>
    </>
  );
};

export default ChatPage;