import React, { useEffect, useState } from 'react';
import { Box, Typography, Stepper, Step, StepLabel, Button, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, updatePost } from '../redux/Slice/postslice';
import { AppDispatch, RootState } from '../redux/store';
import PostDetailsForm from '../components/postdetailsform';
import PostRentForm from '../components/postrentform';
import PostPreferencesForm from '../components/postpreferencesform';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface PostFormData {
  bedrooms: number;
  bathrooms: number;
  spotType: string;
  address: {
    street: string;
    city: string;
    area: string;
  };
  description: string;
  rent: string;
  deposit: string;
  availableFrom: string;
  leaseDuration: string;
  photos: string[];
  amenities: string[];
  preferences: {
    foodPreferences: string;
    gender: string;
    drinking: boolean;
    smoking: boolean;
    specialRequirements: string;
  };
}

interface CreatePostProps {
  isEditMode?: boolean; // Flag for edit mode
}

const CreatePost: React.FC<CreatePostProps> = ({ isEditMode = false }) => {
  const { postId } = useParams<{ postId: string }>(); // Extract postId from URL (for edit mode)
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState<PostFormData>({
    bedrooms: 1,
    bathrooms: 1,
    spotType: '',
    address: {
      street: '',
      city: '',
      area: '',
    },
    description: '',
    rent: '',
    deposit: '',
    availableFrom: '',
    leaseDuration: '',
    photos: [],
    amenities: [],
    preferences: {
      foodPreferences: '',
      gender: '',
      drinking: false,
      smoking: false,
      specialRequirements: '',
    },
  });

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state for form submission
  const [fetchingPost, setFetchingPost] = useState(false); // Loading state for fetching post details
  const steps = ['Details & Address', 'Rent & Description', 'Amenities & Preferences'];

  // Fetch post data for editing
  useEffect(() => {
    if (isEditMode && postId) {
      const fetchPostDetails = async () => {
        setFetchingPost(true);
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts/${postId}`);
          setFormData(response.data); // Populate form with fetched data
        } catch (error) {
          console.error('Error fetching post details:', error);
          alert('Failed to load post details.');
        } finally {
          setFetchingPost(false);
        }
      };

      fetchPostDetails();
    }
  }, [isEditMode, postId]);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
      const updatedForm = { ...prev };
      const keys = field.split('.');
      let pointer: any = updatedForm;

      for (let i = 0; i < keys.length - 1; i++) {
        pointer = pointer[keys[i]];
      }

      pointer[keys[keys.length - 1]] = value;
      return updatedForm;
    });
  };

  const handleSubmit = async () => {
    setLoading(true); // Show loading spinner
    const postData = {
      ...formData,
      createdBy: user.id, // Include user ID for create
    };

    try {
      if (isEditMode && postId) {
        await dispatch(updatePost({ postId, postData })).unwrap();
        alert('Post updated successfully!');
      } else {
        await dispatch(createPost(postData)).unwrap();
        alert('Post created successfully!');
      }
      resetForm();
      navigate('/home');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  const resetForm = () => {
    setFormData({
      bedrooms: 1,
      bathrooms: 1,
      spotType: '',
      address: {
        street: '',
        city: '',
        area: '',
      },
      description: '',
      rent: '',
      deposit: '',
      availableFrom: '',
      leaseDuration: '',
      photos: [],
      amenities: [],
      preferences: {
        foodPreferences: '',
        gender: '',
        drinking: false,
        smoking: false,
        specialRequirements: '',
      },
    });
    setActiveStep(0);
  };

  if (fetchingPost) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, maxWidth: '800px', margin: 'auto', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <Typography variant="h4" sx={{ marginBottom: 4, color: '#495057' }}>
        {isEditMode ? 'Edit Post' : 'Ready to Share Your Space? Let’s Begin!'}
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ marginBottom: 4, padding: "2.5rem", backgroundColor: '#686D76'}}>
        {steps.map((label) => (
          <Step key={label} >
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <PostDetailsForm formData={formData} handleInputChange={handleInputChange} />
      )}
      {activeStep === 1 && (
        <PostRentForm formData={formData} handleInputChange={handleInputChange} />
      )}
      {activeStep === 2 && (
        <PostPreferencesForm formData={formData} handleInputChange={handleInputChange} />
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{
            backgroundColor: '#f8f9fa',
            color: '#495057',
            '&:hover': { backgroundColor: '#e9ecef' },
          }}
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          sx={{
            backgroundColor: '#686D76',
            color: '#fff',
            '&:hover': { backgroundColor: '#5C5470' },
          }}
        >
          {activeStep === steps.length - 1 ? (
            loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : isEditMode ? (
              'Update'
            ) : (
              'Submit'
            )
          ) : (
            'Next'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default CreatePost;
