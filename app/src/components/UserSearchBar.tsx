import React, { useState, useEffect } from "react";
import {
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";


interface User {
  userId: string|null
  name: string;
}

interface UserSearchBarProps {
  userId: string|null;
  initiateOrRetrieveChat: (user1Id: string|null, user2Id: string|null) => void;
}

const UserSearchBar: React.FC<UserSearchBarProps> = ({
  userId,
  initiateOrRetrieveChat,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user);
  const currentUserid=user.id
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/chats/search?name=${query}`
      );
      const data = await response.json();

      if (data.success) {
        const filteredUsers = data.data.filter((user: { userId: string }) => user.userId !== currentUserid);
        setSearchResults(filteredUsers);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      searchUsers(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleUserSelect = (user2Id: string|null) => {
    initiateOrRetrieveChat(userId, user2Id); // Call the initiate or retrieve chat function
    setSearchQuery(""); // Clear the search input
    setSearchResults([]); // Clear the results
  };

  return (
    <div className="search-bar-container">
      <TextField
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search users..."
        variant="outlined"
        fullWidth
        InputProps={{
          endAdornment: (
            <IconButton onClick={() => searchUsers(searchQuery)}>
              <SearchIcon />
            </IconButton>
          ),
        }}
      />
      {loading && <CircularProgress />}
      {searchResults.length > 0 && (
        <List>
          {searchResults.map((user) => (
            <ListItem
              key={user.userId}
              component="div" // Explicitly set the component type to "div"
              onClick={() => handleUserSelect(user.userId)}
              style={{ cursor: "pointer" }} // Add pointer cursor for clarity
            >
              <ListItemText primary={user.name} />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default UserSearchBar;