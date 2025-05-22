import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, CircularProgress, Grid, Typography, Alert } from '@mui/material';
import PostCard from '../components/postcard'; // Import the PostCard component
import HpNavbar from '../components/hpnavabar'; // Import the Navbar component
import axios from 'axios';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';

// Interfaces for the data structure
interface CreatedBy {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface TaggedRoommate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
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

interface Post {
  _id: string;
  postId: string;
  city?: string;
  rent: number;
  availableFrom: string;
  photos: string[];
  createdBy: CreatedBy;
  taggedRoommates: TaggedRoommate[];
  address: Address;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  preferences: Preferences;
  deposit: number;
  description: string;
  leaseDuration: number | string;
  spotType: string;
}

const UserPosts: React.FC = () => {
  const { userId } = useParams<{ userId: string }>(); // Get the userId from the route params
  const [posts, setPosts] = useState<Post[]>([]); // State to store posts
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for errors
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  // Fetch posts on component mount
  useEffect(() => {
    console.log('User ID:', userId); // Debug: Log the userId

    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts/user/${userId}`);
        console.log('Full API Response:', response); // Debug: Log the full API response
        const fetchedPosts = response.data || []; // Fallback to an empty array if no posts
        console.log('Fetched Posts:', fetchedPosts); // Debug: Log fetched posts
        setPosts(fetchedPosts); // Update state with the posts
        setLoading(false); // Stop loading
      } catch (err: any) {
        console.error('Error fetching posts:', err); // Debug: Log the error
        setError(err.response?.data?.message || 'Failed to load posts'); // Set error message
        setLoading(false); // Stop loading
      }
    };

    fetchUserPosts(); // Fetch posts
  }, [userId]); // Re-run if userId changes

  // Show a loading spinner while fetching data
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show an error message if the API call fails
  if (error) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Show a message if no posts are found
  if (!posts || posts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Typography variant="h6">No posts found for this user.</Typography>
      </Box>
    );
  }

  const handleStartChat = async (userIdToChatWith: string) => {
    try {
        const userId = user.id; // Replace with your logic to get the logged-in user's ID
  
        // Fetch user name
        const userResponse = await fetch(`h${process.env.REACT_APP_API_URL}/profile/${userIdToChatWith}`);
        const userResult = await userResponse.json();
  
        if (!userResult?.user) {
            console.error("Failed to fetch user details.");
            return;
        }
  
        const userName = `${userResult.user.firstName} ${userResult.user.lastName}`;
  
        // API call to initiate or retrieve the chat
        const response = await fetch("${process.env.REACT_APP_API_URL}/chats", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user1Id: userId, user2Id: userIdToChatWith }),
        });
  
        const result = await response.json();
  
        if (result.success) {
            const newChat = result.data;
  
            // Navigate to the chat page, passing the chat and userName
            navigate("/inbox", {
                state: { newChat, preFetchedNames: { [userIdToChatWith]: userName } },
            });
        } else {
            console.error("Failed to initiate chat:", result.message);
        }
    } catch (error) {
        console.error("Error initiating chat:", error);
    }
  };
  

  // Render the posts
  return (
    <>
      <HpNavbar /> {/* Render the navbar */}
      <Box sx={{ padding: 4, maxWidth: '1200px', margin: '0 auto' }}>
        <Typography variant="h4" sx={{ marginBottom: 4 }}>
          Posts by User
        </Typography>
        <Grid container spacing={4}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post._id}>
              <PostCard
                postId={post.postId}
                city={post.address?.city || 'Unknown City'}
                rent={post.rent}
                availableFrom={new Date(post.availableFrom).toLocaleDateString()}
                photos={post.photos}
                createdBy={post.createdBy}
                taggedRoommates={post.taggedRoommates}
                address={post.address}
                bedrooms={post.bedrooms}
                bathrooms={post.bathrooms}
                amenities={post.amenities}
                preferences={post.preferences}
                deposit={post.deposit}
                description={post.description}
                leaseDuration={post.leaseDuration.toString()}
                spotType={post.spotType}
                onStartChat={handleStartChat} // Pass chat initiation handler
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default UserPosts;
