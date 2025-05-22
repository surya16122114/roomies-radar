import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Stepper, Step, StepLabel } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ProfileFormStep1 from '../components/profileformstep1';
import ProfileFormStep2 from '../components/profileformstep2';
import ProfileFormStep3 from '../components/profileformstep3';

const EditProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const steps = ['Basic Information', 'Work & Education', 'Preferences'];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile/${userId}`);
        setProfile(response.data.profile);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load profile data');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/profile/${userId}`, profile);
      if (response.status === 200) {
        navigate(`/profile/${userId}`); // Redirect to the user's profile page
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Profile update failed');
    }
  };

  if (loading) return <Typography variant="h6">Loading...</Typography>;
  if (error) return <Typography variant="h6" color="error">{error}</Typography>;

  return (
    <Box sx={{ padding: '2.5rem', margin:'2rem 2rem 2rem 2rem', backgroundColor: '#F4F2EE', borderRadius:'2rem'}}>
      <Typography variant="h4" sx={{ marginBottom: 3, fontFamily: 'Cambria, Cochin, Georgia, Times, Times New Roman, serif'}}>
        Edit intro
      </Typography>
      <Stepper activeStep={activeStep} sx={{ marginBottom: 3, fontFamily: 'Cambria, Cochin, Georgia, Times, Times New Roman, serif' }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && <ProfileFormStep1 profile={profile} setProfile={setProfile} />}
      {activeStep === 1 && <ProfileFormStep2 profile={profile} setProfile={setProfile} />}
      {activeStep === 2 && (
        <ProfileFormStep3
          profile={profile}
          setProfile={setProfile}
          error={error || ''}
        />
      )}

      <Box sx={{ marginTop: 3 }}>
        {activeStep > 0 && (
          <Button variant="outlined" onClick={handleBack} sx={{ marginRight: 2 }}>
            Back
          </Button>
        )}
        {activeStep < steps.length - 1 && (
          <Button variant="contained" onClick={handleNext} >
            Next
          </Button>
        )}
        {activeStep === steps.length - 1 && (
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default EditProfile;
