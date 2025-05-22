import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, MenuItem, Select, FormControl, InputLabel, Box, Typography, SelectChangeEvent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../redux/Slice/userslice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileUpdate: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Accessing user details from Redux store
  const user = useSelector((state: any) => state.user);
  
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [DOB, setDOB] = useState(user.DOB || '');
  const [email, setEmail] = useState(user.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user.PhoneNumber || ''); 
  const [gender, setGender] = useState(user.Gender || ''); 
  const [age, setAge] = useState(user.age || '');
  const [hometown, setHometown] = useState(user.hometown || '');
  const [course, setCourse] = useState(user.course || '');
  const [college, setCollege] = useState(user.college || '');
  const [primaryLanguage, setPrimaryLanguage] = useState(user.primaryLanguage || '');
  const [otherLanguage, setOtherLanguage] = useState(user.otherLanguage || '');
  const [foodType, setFoodType] = useState(user.foodType || '');
  const [workExperience, setWorkExperience] = useState({
    companyName: user.workExperience?.companyName || '',
    role: user.workExperience?.role || '',
    tenure: user.workExperience?.tenure || ''
  });
  const [otherHabits, setOtherHabits] = useState(user.otherHabits || '');
  const [hobbies, setHobbies] = useState(user.hobbies || []);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user.id) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/profile/${user.id}`, {
        firstName,
        lastName,
        DOB,
        email,
        phoneNumber, 
        gender, 
        age,
        hometown,
        course,
        college,
        primaryLanguage,
        otherLanguage,
        foodType,
        workExperience,
        otherHabits,
        hobbies
      });

      if (response.status === 200) {
        dispatch(setUserDetails(response.data)); // Update user state with new details
        setSuccess(true);
        alert('Profile updated successfully!');
        setTimeout(() => navigate('/profile'), 2000);
      }
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  return (
    <Box sx={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <Typography variant="h4" align="center" gutterBottom>Update Profile</Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Form Fields */}
          {/* Repeat for other fields */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth>
              Update Profile
            </Button>
          </Grid>
        </Grid>
      </form>
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default ProfileUpdate;
