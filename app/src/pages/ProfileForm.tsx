import React, { useState } from 'react';
import { Box, Button, Stepper, Step, StepLabel, Typography } from '@mui/material';
import ProfileFormStep1 from '../components/profileformstep1';
import ProfileFormStep2 from '../components/profileformstep2';
import ProfileFormStep3 from '../components/profileformstep3';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/profileform.css';
import HpNavbar from '../components/hpnavabar';

const ProfileForm: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [profile, setProfile] = useState({
    bio: '',
    gender: '',
    age: 0,
    city: '',
    course: '',
    college: '',
    primaryLanguage: '',
    otherLanguage: '',
    foodType: '',
    workExperience: {
      companyName: '',
      role: '',
      tenure: '',
    },
    education: {
      school: '',
      degree: '',
      fieldOfStudy: '',
    },
    hobbies: [] as string[],
    preferences: {
      foodPreferences: '',
      gender: '',
      drinking: false,
      smoking: false,
      anySpecialRequirements: '',
    },
  });

  const [error, setError] = useState<string>(''); // Default to an empty string

  const steps = ['Basic Information', 'Work & Education', 'Preferences'];

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
    try {
      if (!userId) {
        throw new Error("User ID is missing. Please sign up again.");
      }

      // Append userId to the request body
      const payload = { ...profile, userId };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/profile`, // Backend API endpoint
        payload
      );

      if (response.status === 201) {
        console.log("Profile created successfully:", response.data);
        navigate("/login"); // Redirect to login page
      } else {
        throw new Error("Failed to create profile");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An unexpected error occurred.');
      console.error("Error creating profile:", err.response?.data || err.message);
    }
  };

  return (
    <section className='completeedit'>
      <Box sx={{ padding: 4, maxWidth: '800px', margin: 'auto', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <Typography variant="h4" sx={{ marginBottom: 3, fontFamily:'Cambria, Cochin, Georgia, Times, "Times New Roman", serif' }}>
      Help potential roommates get to know you better!
      </Typography>
      <Stepper activeStep={activeStep} sx={{ marginBottom: 4, padding: "2.5rem", backgroundColor: '#686D76'}}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <ProfileFormStep1 profile={profile} setProfile={setProfile} />
      )}
      {activeStep === 1 && (
        <ProfileFormStep2
          profile={profile}
          setProfile={setProfile}
        />
      )}
      {activeStep === 2 && (
        <ProfileFormStep3
          profile={profile}
          setProfile={setProfile}
          error={error || ''} // Ensure `error` is a string
        />
      )}

      {error && (
        <Typography variant="body2" color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
        {activeStep > 0 && (
          <Button  onClick={handleBack}   sx={{
            backgroundColor: '#f8f9fa',
            color: '#495057',
            '&:hover': { backgroundColor: '#e9ecef' },}}>
            Back
          </Button>
        )}
        {activeStep < steps.length - 1 && (
          <Button variant="contained" onClick={handleNext} sx={{backgroundColor: '#686D76',
            color: '#fff',
            '&:hover':  {backgroundColor: '#5C5470'},}}>
            Next
          </Button>
        )}
        {activeStep === steps.length - 1 && (
          <Button variant="contained" color="primary" onClick={handleSubmit}  sx={{
            backgroundColor: '#686D76',
            color: '#fff',
            '&:hover': { backgroundColor: '#5C5470' },
          }}>
            Submit
          </Button>
        )}
      </Box>
    </Box>
    </section>
  );
};

export default ProfileForm;
