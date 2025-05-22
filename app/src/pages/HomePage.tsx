import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../redux/Slice/postslice';
import { RootState, AppDispatch } from '../redux/store';
import PostCard from '../components/postcard';
import HpNavbar from '../components/hpnavabar';
import FilterSection from '../components/filterssection';
import '../styles/HomePage.css';
import { Grid, Typography, Card, CircularProgress, Box, Button, colors } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Footer from '../components/footer';
import { useTranslation } from 'react-i18next';


const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(1);
  const postsState = useSelector((state: RootState) => state.posts);
  const user = useSelector((state: RootState) => state.user);
  const { items: posts, loading: isLoading, error, currentPage: serverPage, totalPages } = postsState;
  const navigate = useNavigate();
  // Fetch posts whenever `currentPage` changes
  const { t } = useTranslation();
  useEffect(() => {
    dispatch(fetchPosts({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const currentUserId=user.id;
const handleStartChat = async (userIdToChatWith: string) => {
  try {
      const userId = currentUserId; // Replace with your logic to get the logged-in user's ID

      // Fetch user name
      const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/profile/${userIdToChatWith}`);
      const userResult = await userResponse.json();

      if (!userResult) {
          console.error("Failed to fetch user details.");
          return;
      }

      const userName = `${userResult.profile.userId.firstName} ${userResult.profile.userId.lastName}`;

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


  return (
    <>
      <HpNavbar/>
    <div className="homepage-container">
      <div className="hero-section">
        <div className='opening'>
          <h1>{t('header')}</h1>
          <h4>✨{t('tag')}</h4>
        </div>
        <div className='openingright'>
        <Typography variant="h5" className="hero-title"
        fontFamily='Cambria, Cochin, Georgia, Times, "Times New Roman", serif'
      fontSize='3rem' padding='2rem' color='#5C5470'
        >
        <strong>{t('welcome')} {user.firstName}!
        {t('tagline')}</strong>


        </Typography>
        </div>
        
      </div>
      <div className="main-content">
        <Grid container spacing={4}>
          {/* Filters Section */}
          <Grid item xs={12} md={3}>
            <Card className="filters-section">
              <FilterSection />
            </Card>
          </Grid>
          {/* Posts Section */}
          <Grid item xs={12} md={9}>
            <div className="posts-section">
              <Typography variant="h5" className="posts-title">
                <h2>{t('discoverPosts')}</h2>
              </Typography>
              {isLoading ? (
                <Box className="loading-container">
                  <CircularProgress />
                  <Typography>Loading posts...</Typography>
                </Box>
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : posts.length > 0 ? (
                <>
                  <Grid container spacing={3} className="posts-grid">
                    {posts.map((post: any) => (
                      <Grid item xs={12} sm={6} md={4} key={post._id}>
                        <PostCard
                          postId={post.postId}
                          city={post.address?.city}
                          address={post.address}
                          bedrooms={post.bedrooms}
                          bathrooms={post.bathrooms}
                          rent={post.rent}
                          description={post.description}
                          amenities={post.amenities}
                          preferences={post.preferences}
                          photos={post.photos}
                          createdBy={post.createdBy}
                          taggedRoommates={post.taggedRoommates}
                          availableFrom={
                            post.availableFrom
                              ? new Date(post.availableFrom).toLocaleDateString()
                              : 'N/A'
                          }
                          spotType={post.spotType || 'Unknown Room Type'}
                          onStartChat={handleStartChat} // Pass chat initiation handler
                        />
                      </Grid>
                    ))}
                  </Grid>
                  <div className="pagination-controls">
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={currentPage <= 1}
                      onClick={handlePreviousPage}
                    >
                      {t('previous')}
                    </Button>
                    <Typography variant="body2" style={{ margin: '0 1rem' }}>
                      Page {serverPage} of {totalPages}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={currentPage >= totalPages}
                      onClick={handleNextPage}
                      sx={{color: "#5C5470"}}
                    >
                      {t('next')}
                    </Button>
                  </div>
                </>
              ) : (
                <Typography>No listings available</Typography>
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default HomePage;