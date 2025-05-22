import React, { useState } from 'react';
import {
  TextField,
  Chip,
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';

interface PostDetailsFormProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
}

const PostDetailsForm: React.FC<PostDetailsFormProps> = ({ formData, handleInputChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchUsers = async (query: string) => {
    if (!query.trim()) return;
    setIsSearching(true);

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/search?q=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTagUser = (user: any) => {
    const roommates = formData?.taggedRoommates || [];

    // Check if the user is already tagged
    if (!roommates.some((roommate: any) => roommate._id === user._id)) {
      handleInputChange('taggedRoommates', [...roommates, user]);
    }
  };

  const handleRemoveTag = (userId: string) => {
    const roommates = formData?.taggedRoommates || [];
    handleInputChange(
      'taggedRoommates',
      roommates.filter((roommate: any) => roommate._id !== userId)
    );
  };

  if (!formData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div className='post-form'>
    <Box>
      <Typography variant="h5" sx={{ marginBottom: 3, color: '#6c757d' }}>
        Details & Address
      </Typography>

      {/* Bedrooms */}
      <TextField
        label="Bedrooms"
        type="number"
        value={formData.bedrooms || ''}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value)) { // Allow only numeric input
            handleInputChange('bedrooms', value === '' ? '' : parseInt(value, 10));
          }
        }}
        fullWidth
        margin="normal"
      />

      {/* Bathrooms */}
      <TextField
        label="Bathrooms"
        type="number"
        value={formData.bathrooms || ''}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value)) { // Allow only numeric input
            handleInputChange('bathrooms', value === '' ? '' : parseInt(value, 10));
          }
        }}
        fullWidth
        margin="normal"
      />

      {/* Spot Type */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Spot Type</InputLabel>
        <Select
          value={formData.spotType}
          onChange={(e) => handleInputChange('spotType', e.target.value)}
        >
          <MenuItem value="Private Room">Private Room</MenuItem>
          <MenuItem value="Shared Room">Shared Room</MenuItem>
          <MenuItem value="Private Hall">Private Hall</MenuItem>
          <MenuItem value="Shared Hall">Shared Hall</MenuItem>
        </Select>
      </FormControl>

      {/* Street */}
      <TextField
        label="Street"
        value={formData.address.street}
        onChange={(e) => handleInputChange('address.street', e.target.value)}
        fullWidth
        margin="normal"
      />

      {/* City */}
      <TextField
        label="City"
        value={formData.address.city}
        onChange={(e) => handleInputChange('address.city', e.target.value)}
        fullWidth
        margin="normal"
      />

      {/* Area */}
      <TextField
        label="Area"
        value={formData.address.area}
        onChange={(e) => handleInputChange('address.area', e.target.value)}
        fullWidth
        margin="normal"
      />

      {/* Search and Tag Roommates */}
      <Typography variant="h6" sx={{ marginTop: 4, marginBottom: 2 }}>
        Tag Roommates
      </Typography>
      <TextField
        label="Search Roommates (Name or Email)"
        placeholder="Enter name or email"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          fetchUsers(e.target.value);
        }}
        fullWidth
        margin="normal"
      />
      {isSearching && <CircularProgress size={24} sx={{ marginTop: 2 }} />}
      {searchResults.length > 0 && (
        <Box sx={{ marginTop: 2 }}>
          {searchResults.map((user: any) => (
            <Chip
              key={user._id}
              label={`${user.firstName} ${user.lastName} (${user.email})`}
              onClick={() => handleTagUser(user)}
              sx={{ margin: '0.5em' }}
            />
          ))}
        </Box>
      )}

      {/* Display Tagged Roommates */}
      {formData?.taggedRoommates?.length > 0 && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body1">Tagged Roommates:</Typography>
          {formData.taggedRoommates.map((roommate: any) => (
            <Chip
              key={roommate._id}
              label={`${roommate.firstName} ${roommate.lastName}`} // Display full name
              onDelete={() => handleRemoveTag(roommate._id)}
              sx={{ margin: '0.5em' }}
            />
          ))}
        </Box>
      )}
    </Box>
    </div>
  );
};

export default PostDetailsForm;
