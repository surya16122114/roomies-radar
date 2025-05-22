import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import '../styles/PostCard.css';

interface CreatedBy {
  firstName: string;
  lastName: string;
  email: string;
  _id: string;
}

interface Roommate {
  firstName: string;
  lastName: string;
  _id: string;
}

interface Address {
  street?: string;
  city?: string;
  area?: string;
}

interface Preferences {
  foodPreferences?: string;
  gender?: string;
  drinking?: boolean;
  smoking?: boolean;
  specialRequirements?: string;
}

interface PostCardProps {
  postId: string; // Add postId for navigation
  city?: string;
  rent?: number;
  availableFrom?: string;
  photos?: string[];
  createdBy?: CreatedBy;
  taggedRoommates?: Roommate[];
  address?: Address;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  preferences?: Preferences;
  deposit?: number;
  description?: string;
  leaseDuration?: string;
  spotType?: string;
  onStartChat?: (userId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  postId,
  city = 'Unknown City',
  rent = 0,
  availableFrom = '',
  photos = [],
  createdBy,
  taggedRoommates = [],
  address,
  bedrooms = 0,
  bathrooms = 0,
  amenities = [],
  preferences,
  deposit = 0,
  description = 'No description provided',
  leaseDuration = 'Flexible',
  spotType = 'Unknown Room Type',
  onStartChat,
}) => {
  const navigate = useNavigate();
  const currentUserId = useSelector((state: RootState) => state.user.id);

  const fallbackAddress = {
    street: address?.street || 'N/A',
    area: address?.area || 'N/A',
    city: address?.city || 'N/A',
  };

  const handleShare = () => {
    if (navigator.share) {
      const shareData = {
        title: `${city} Apartment - $${rent}/mo`,
        text: `Check out this ${bedrooms}-Bed, ${bathrooms}-Bath apartment in ${city}!`,
        url: `${window.location.origin}/posts/${postId}`,
      };

      navigator
        .share(shareData)
        .then(() => console.log('Share successful!'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
      alert('Web Share API is not supported in your browser.');
    }
  };

  return (
    <Card className="post-card" sx={{ boxShadow: 3, borderRadius: 2 }}>
      <CardMedia
        component="img"
        className="post-card-media"
        image={photos.length > 0 ? photos[0] : 'https://via.placeholder.com/300'}
        alt="Property Image"
        sx={{ height: 200 }}
      />
      <CardContent className="post-card-content">
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6" className="post-card-title">
            {city}, {fallbackAddress.area}
          </Typography>
          <Typography variant="h5" className="post-card-price">
            ${rent.toLocaleString()} / mo
          </Typography>
        </Box>
        <Typography variant="body2" className="post-card-details">
          {bedrooms} Bed · {bathrooms} Bath
        </Typography>
        <Typography variant="body2" className="post-card-room-type">
          {spotType}
        </Typography>
        <Typography variant="body2" className="post-card-availability">
          Available From: {availableFrom || 'N/A'}
        </Typography>
        {createdBy && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
              Posted by:
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                className="post-card-postedby"
                label={`${createdBy.firstName || 'Unknown'} ${createdBy.lastName || 'User'}`}
                onClick={() => navigate(`/profile/${createdBy._id}`)}
                clickable
                color="primary"
              />
              {onStartChat && createdBy._id !== currentUserId && (
                <Button
                  className='post-card-startchat'
                  variant="outlined"
                  color="secondary"
                  size="small"
                  sx={{ borderRadius: '16px', padding: '2px 10px' }}
                  onClick={() => onStartChat(createdBy._id)}
                >
                  ✉️ Chat
                </Button>
              )}
            </Stack>
          </Box>
        )}
        {taggedRoommates.length > 0 && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
              Roommates:
            </Typography>
            {taggedRoommates.map((rm) => (
              <Chip
                className='post-card-tr'
                key={rm._id}
                label={rm.firstName}
                onClick={() => navigate(`/profile/${rm._id}`)}
                clickable
                color="secondary"
                sx={{ marginRight: 1, marginBottom: 1 }}
              />
            ))}
          </Box>
        )}
        <Box sx={{ marginTop: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            className="view-details-button"
            onClick={() => navigate(`/posts/${postId}`)} // Redirect to post details page
          >
            View Details
          </Button>
          <Button className="share-details-button" variant="outlined" color="primary" onClick={handleShare}>
            Share Post
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostCard;

