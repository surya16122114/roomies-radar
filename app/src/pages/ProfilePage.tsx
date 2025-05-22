import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { Avatar, Box, Grid, Paper, Typography, Button } from '@mui/material';
import HpNavbar from '../components/hpnavabar';
import '../styles/profilepage.css';
import { useNavigate } from 'react-router-dom';

// Utility function to calculate age from DOB
const calculateAge = (dob: string) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  // Log user data to check if it's available in Redux
  useEffect(() => {
    console.log('User data from Redux:', user);
  }, [user]);

  // Check if user data is available before rendering
  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Loading profile...</Typography>
      </Box>
    );
  }

  // Generate initials from the user's name
  const getInitials = (firstName: string | null, lastName: string | null) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return firstName?.charAt(0).toUpperCase() || 'U'; // 'U' as a default fallback
  };

  // Handle user details
  const { firstName, lastName, DOB, email, course, college, primaryLanguage, otherLanguages, foodType, workExperience, otherHabits, hobbies, hometown } = user;


  const navigate = useNavigate();

  // Handle Edit and Delete functionality (dispatch actions)
  const handleEdit = () => {
    navigate('/updateprofile');
  };


  return (
    <>
      <HpNavbar />
      <div className="complete">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
        <Paper sx={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '800px', width: '100%' }}>
          <Avatar
            sx={{
              bgcolor: '#3f51b5',
              width: 100,
              height: 100,
              fontSize: 40,
            }}
          >
            {getInitials(firstName, lastName)}
          </Avatar>
          <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
            {firstName} {lastName}
          </Typography>
          <Typography variant="body1" sx={{ color: 'gray' }}>
            {email}
          </Typography>
          {DOB && <Typography variant="body1" sx={{ mt: 1 }}>Age: {calculateAge(DOB.toString())} years</Typography>}

          {/* Displaying other details */}
          <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1"><strong>Course:</strong> {course || 'N/A'}</Typography>
              <Typography variant="body1"><strong>College:</strong> {college || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Primary Language:</strong> {primaryLanguage || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Other Languages:</strong> {otherLanguages || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1"><strong>Food Type:</strong> {foodType || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Work Experience:</strong> {workExperience || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Other Habits:</strong> {otherHabits || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Hobbies:</strong> {hobbies || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Hometown:</strong> {hometown || 'N/A'}</Typography>
            </Grid>
          </Grid>

          {/* Edit and Delete buttons */}
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" onClick={handleEdit} sx={{ mr: 2 }}>
              Edit
            </Button>
            {/* <Button variant="contained" color="error" onClick={handleDelete}>
              Delete
            </Button> */}
          </Box>
        </Paper>
      </Box>
      </div>
    </>
  );
};

export default ProfilePage;
