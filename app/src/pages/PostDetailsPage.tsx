import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardMedia, Grid, Avatar, Chip, Button, CircularProgress } from '@mui/material';
import HpNavbar from '../components/hpnavabar';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const PostDetailsPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const currentUserId = user.id;

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts/${postId}`);
        setPost(response.data);
      } catch (err: any) {
        setError('Failed to load post details. Please try again later.');
        console.error('Error fetching post details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId]);

  const onStartChat = async (userIdToChatWith: string) => {
    try {
      const userId = currentUserId;

      const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/profile/${userIdToChatWith}`);
      const userResult = await userResponse.json();

        if (!userResult?.profile) {
            console.error("Failed to fetch user details.");
            return;
        }

        const userName = `${userResult.profile.userId.firstName} ${userResult.profile.userId.lastName}`;

      const response = await fetch('${process.env.REACT_APP_API_URL}/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user1Id: userId, user2Id: userIdToChatWith }),
      });

      const result = await response.json();

      if (result.success) {
        const newChat = result.data;

        navigate('/inbox', {
          state: { newChat, preFetchedNames: { [userIdToChatWith]: userName } },
        });
      } else {
        console.error('Failed to initiate chat:', result.message);
      }
    } catch (error) {
      console.error('Error initiating chat:', error);
    }
  };

  const onDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/posts/${postId}`);
        alert('Post deleted successfully!');
        navigate('/home'); // Redirect to home or a specific page after deletion
      } catch (err: any) {
        console.error('Error deleting post:', err);
        alert('Failed to delete post. Please try again later.');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box sx={{ padding: 4 }}>
        <Typography variant="h6" color="error">
          Post not found.
        </Typography>
      </Box>
    );
  }

  const fallbackImage = 'https://via.placeholder.com/300';
  const photos = post.photos || [];
  const maxPhotos = 5;
  const displayedPhotos = [...photos, ...Array(maxPhotos - photos.length).fill(null)];

  return (
    <Box sx={{ fontFamily: 'Parkinsans, sans-serif', padding: '20px' }}>
      <HpNavbar />
      <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {/* Title */}
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#686D76', marginBottom: '20px' }}>
          {'Listing Details'}
        </Typography>

        {/* Photo Section */}
        <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
          {displayedPhotos.map((photo, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              {photo ? (
                <CardMedia
                  component="img"
                  image={photo}
                  alt={`Photo ${index + 1}`}
                  sx={{
                    borderRadius: '8px',
                    objectFit: 'cover',
                    border: '1px solid #ddd',
                    height: '200px', // Increased height
                    width: '100%', // Ensure the photo uses full width
                  }}
                />
              ) : (
                <Box
                  sx={{
                    height: '200px', // Match placeholder height with photo size
                    backgroundColor: '#f0f0f0',
                    border: '1px dashed #ccc',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#aaa',
                  }}
                >
                  No Image
                </Box>
              )}
            </Grid>
          ))}
        </Grid>

        {/* Rent Details */}
        <Card
          sx={{
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            marginBottom: '20px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#5C5470', marginBottom: '10px' }}>
            ${post?.rent || 'N/A'} / mo
          </Typography>
          <Typography variant="body2" sx={{ color: '#555', marginBottom: '8px' }}>
            Lease Duration: {post?.leaseDuration || 'N/A'} months
          </Typography>
          <Typography variant="body2" sx={{ color: '#555', marginBottom: '8px' }}>
            Type: {post?.spotType || 'N/A'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#555', marginBottom: '8px' }}>
            Layout: {post?.bedrooms || 0} Bed · {post?.bathrooms || 0} Bath
          </Typography>
          <Typography variant="body2" sx={{ color: '#555', marginBottom: '8px' }}>
            Deposit: ${post?.deposit || 'N/A'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#555', marginBottom: '8px' }}>
            Address: {`${post?.address?.street || 'N/A'}, ${post?.address?.area || 'N/A'}, ${post?.address?.city || 'N/A'}`}
          </Typography>

          {/* Posted By Field */}
          <Box sx={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #ddd' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '8px', color: '#5C5470' }}>
              Posted By:
            </Typography>
            <Box
              sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px', cursor: 'pointer' }}
              onClick={() => navigate(`/profile/${post?.createdBy?._id}`)} // Redirect to the creator's profile
            >
              <Avatar
                sx={{ width: '40px', height: '40px', marginRight: '10px' }}
                alt={post?.createdBy?.name || 'User'}
                src={post?.createdBy?.avatar || ''}
              />
              <Box>
                <Typography sx={{ fontWeight: 'bold', color: '#686D76', '&:hover': { color: 'darkblue' } }}>
                  {`${post?.createdBy?.firstName || 'Unknown'} ${post?.createdBy?.lastName || ''}`}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555' }}>
                  {post?.createdBy?.email || 'Email not available'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            {currentUserId === post?.createdBy?._id ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ fontWeight: 'bold', padding: '10px 20px', backgroundColor: '#5C5470' }}
                  onClick={() => navigate(`/edit-post/${postId}`)}
                >
                  Edit Post
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ fontWeight: 'bold', padding: '10px 20px',backgroundColor: '#803D3B' }}
                  onClick={onDeletePost}
                >
                  Delete Post
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                sx={{ fontWeight: 'bold', padding: '10px 20px', flex: 1, backgroundColor: '#5C5470'}}
                onClick={() => onStartChat(post?.createdBy?._id)}
              >
                Start Chat
              </Button>
            )}
          </Box>
        </Card>

        {/* Tagged Roommates */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
          Tagged Roommates
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          {post?.taggedRoommates?.map((roommate: any, index: number) => (
            <Chip
              key={index}
              avatar={<Avatar>{roommate?.firstName?.[0]}</Avatar>}
              label={`${roommate?.firstName || ''} ${roommate?.lastName || ''}`}
              sx={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#555',
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#black' },
              }}
              onClick={() => navigate(`/profile/${roommate?._id}`)} // Redirect to roommate's profile
            />
          ))}
        </Box>

        {/* Preferences */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
        Roommate Preferences & Expectations
        </Typography>
        <Box>
          <Typography variant="body2" sx={{ color: '#555', marginBottom: '5px' }}>
            Food Preferences: {post?.preferences?.foodPreferences || 'Any'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#555', marginBottom: '5px' }}>
            Smoking Allowed: {post?.preferences?.smoking ? 'Yes' : 'No'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#555', marginBottom: '5px' }}>
            Drinking Allowed: {post?.preferences?.drinking ? 'Yes' : 'No'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PostDetailsPage;
