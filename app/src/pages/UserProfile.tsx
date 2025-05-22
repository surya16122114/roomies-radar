import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Typography, Button, Grid, CircularProgress, Box, Avatar, Chip, Alert } from '@mui/material';
import axios from 'axios';
import HpNavbar from '../components/hpnavabar';
import { RootState } from '../redux/store';
import Footer from '../components/footer';

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const currentUserId = useSelector((state: RootState) => state.user.id);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile/${userId}`);
        setProfile(response.data.profile);
        setLoading(false);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Profile not found. Would you like to complete your profile?");
        } else {
          setError(err.response?.data?.message || "Failed to fetch profile");
        }
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, navigate]);

  const handleEditProfile = () => {
    if (userId) {
      navigate(`/edit-profile/${userId}`); // Dynamically add userId to the route
    } else {
      console.error("User ID is missing");
    }
  };

  const handleCompleteProfile = () => {
    navigate(`/profileform/${userId}`);
  };

  const handleStartChat = () => {
    navigate(`/chat/${userId}`);
  };

  const handleViewPosts = () => {
    navigate(`/user-posts/${userId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#5C5470'}}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: '2rem' }}>
        <Alert severity="error" sx={{ marginBottom: 3 }}>
          {error}
        </Alert>
        {error.includes("Profile not found") && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleCompleteProfile}
            sx={{ borderRadius: 3 }}
          >
            Complete Profile
          </Button>
        )}
      </Box>
    );
  }

  return (
    <>
      <HpNavbar />
      <Box sx={{ backgroundColor: '#F4F2EE', height: '90vh'}}>
      <Typography fontFamily='Cambria, Cochin, Georgia, Times, "Times New Roman", serif'
      fontSize='2rem' textAlign='center' padding='2rem' color='#5C5470'
      >
        <strong>Discover, Edit, and Share Your Story with Roomies Radar.</strong>
        </Typography>

      <Box sx={{ padding: 4, maxWidth: '1200px', margin: '0 auto' }}>
        <Grid container spacing={4}>
          {/* Left Section */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                padding: 4,
                textAlign: 'center',
                boxShadow: 3,
                borderRadius: 3,
                backgroundColor: '#f5f5f5',
              }}
            >
              <Avatar
                alt={`${profile.userId.firstName} ${profile.userId.lastName}`}
                sx={{
                  width: 150,
                  height: 150,
                  margin: 'auto',
                  marginBottom: 2,
                  bgcolor: '#5C5470',
                  fontSize: 40,
                  // color: '#5C5470'
                }}
              >
                {`${profile.userId.firstName.charAt(0)}${profile.userId.lastName.charAt(0)}`.toUpperCase()}
              </Avatar>
              <Typography variant="h5" fontWeight="bold">
                {`${profile.userId.firstName} ${profile.userId.lastName}`}
              </Typography>
              <Typography variant="subtitle1" color="#1c0063">
                {profile.userId.email}
              </Typography>
              <Typography variant="body1" sx={{ marginTop: 1 }}>
                {profile.age} years old
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 2 }}>
                From {profile.city || "N/A"}
              </Typography>
              {currentUserId === userId ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEditProfile}
                    sx={{ marginTop: 2, borderRadius: 3 , backgroundColor: '#5C5470', marginRight:'.5rem',}}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleViewPosts}
                    sx={{ marginTop: 2, borderRadius: 3, borderColor: '#5C5470', color: '#5C5470' }}
                  >
                    View My Posts
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleStartChat}
                    sx={{ marginTop: 2, borderRadius: 3, marginRight:'1rem', borderColor: '#5C5470',backgroundColor: '#5C5470'}}
                  >
                    Start Chat
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleViewPosts}
                    sx={{ marginTop: 2, borderRadius: 3, borderColor: '#5C5470', color: '#5C5470' }}
                  >
                    View Posts
                  </Button>
                </>
              )}
            </Card>
          </Grid>

          {/* Right Section */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                padding: 4,
                boxShadow: 3,
                borderRadius: 3,
                backgroundColor: '#ffffff',
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Bio:
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 3 }}>
                {profile.bio || "N/A"}
              </Typography>

              <Typography variant="h6" fontWeight="bold">
                Education:
              </Typography>
              <Typography variant="body1">School: {profile.education?.school || "N/A"}</Typography>
              <Typography variant="body1">Degree: {profile.education?.degree || "N/A"}</Typography>
              <Typography variant="body1" sx={{ marginBottom: 3 }}>
                Field of Study: {profile.education?.fieldOfStudy || "N/A"}
              </Typography>

              <Typography variant="h6" fontWeight="bold">
                Work Experience:
              </Typography>
              <Typography variant="body1">Worked At: {profile.workExperience?.companyName || "N/A"}</Typography>
              <Typography variant="body1">Role: {profile.workExperience?.role || "N/A"}</Typography>
              <Typography variant="body1" sx={{ marginBottom: 3 }}>
                Tenure: {profile.workExperience?.tenure || "N/A"} months
              </Typography>

              <Typography variant="h6" fontWeight="bold">
                Preferences:
              </Typography>
              <Typography variant="body1">
                Food Preferences: {profile.preferences?.foodPreferences || "N/A"}
              </Typography>
              <Typography variant="body1">
                Gender Preference: {profile.preferences?.gender || "N/A"}
              </Typography>
              <Typography variant="body1">
                Drinking Allowed: {profile.preferences?.drinking ? "Yes" : "No"}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 3 }}>
                Smoking Allowed: {profile.preferences?.smoking ? "Yes" : "No"}
              </Typography>

              <Typography variant="h6" fontWeight="bold">
                Hobbies:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', marginBottom: 3 }}>
                {profile.hobbies?.length > 0
                  ? profile.hobbies.map((hobby: string, index: number) => (
                      <Chip key={index} label={hobby} variant="outlined" />
                    ))
                  : "N/A"}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
      </Box>
      <Footer/>
    </>
  );
};

export default UserProfile;
