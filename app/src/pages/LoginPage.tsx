import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginFailure, loginSuccess } from '../redux/Slice/authstate';
import { setUserDetails } from '../redux/Slice/userslice';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  useMediaQuery,
  Theme,
  colors,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LoginSideImage from '../assets/Image.jpg';
import theme from '../materialui/theme';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const theme: Theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:4000/auth/user/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, user } = response.data;

        // Store token locally
        localStorage.setItem('authToken', token);

        // Dispatch actions to Redux
        dispatch(loginSuccess(token));
        dispatch(
          setUserDetails({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            DOB: user.DOB,
          })
        );

        navigate('/home');
      } else {
        alert('Login failed!');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      dispatch(loginFailure(err.response?.data?.message));
    }
  };

  return (
    <Grid container sx={{ height: '100vh', overflow: 'hidden' }}>
      {/* Side Image Section */}
      <Grid
        item
        xs={12}
        sm={6}
        sx={{
          display: { xs: 'none', sm: 'block' },
          backgroundImage: `url(${LoginSideImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Login Form Section */}
      <Grid
        item
        xs={12}
        sm={6}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <Container maxWidth="xs">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '4rem', md: '5rem' },
              fontWeight: 500,
              textAlign: 'center',
              mb: 4,
              fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif'
            }}
          >
            Login Page
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            {/* Email Field */}
            <Box component="label" style={{fontSize:'1.5rem'}}><label htmlFor="email"><strong>Email</strong></label></Box>

            <TextField
              label="Enter Email"
              type="email"
              fullWidth
              margin="normal"
              variant="standard"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password Field */}
            <Box component="label" style={{fontSize:'1.5rem'}}><label htmlFor="password"><strong>Password</strong></label></Box>
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              variant="standard"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mt: 2, border:'none' }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: '#5C5470',
                '&:hover': {
                  backgroundColor: '#cecece',
                  color: '#000',
                  boxShadow: 'none',
                  border: '1px solid #000',
                },
                fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif'
              }}
            >
              Login
            </Button>

            {/* Error Message */}
            {error && (
              <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                {error}
              </Typography>
            )}

            {/* Sign-Up Link */}
            <Typography sx={{ mt: 2, textAlign: 'center' , fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif', fontSize:'1.5rem'}}>
              Don&apos;t have an account?{' '}
              <Link to="/Signup" style={{ color:'#5C5470' }}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};

export default Login;
