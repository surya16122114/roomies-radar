import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, TextField, Button, Alert } from '@mui/material';
import SideImage from "../assets/Image.jpg";

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [DOB, setDOB] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/user/register`, {
        firstName,
        lastName,
        DOB,
        email,
        password,
      });

      if (response.status === 201 && response.data.user) {
        const { user } = response.data;
        setSuccess(true);
        console.log('Registration successful:', user);
        navigate(`/profileform/${user._id}`);
      } else {
        setError('Unexpected response from the server');
      }
    } catch (err: any) {
      console.error('Registration error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Registration Failed.');
    }
  };

  return (
    <Grid container className="Section" sx={{ overflow: 'hidden' }}>
      {/* Side Image */}
      <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
          <img src={SideImage} alt="Signup Side" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Box>
      </Grid>

      {/* Signup Form */}
      <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box
          className="signupform"
          sx={{
            width: { xs: '90%', md: '600px' },
            position: 'relative',
            top: { md: '-2rem' },
          }}
        >
          <Typography variant="h2" sx={{ fontSize: { xs: '2.5rem', md: '4.5rem' }, fontWeight: 500, mb: 2 , fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif'}}>
            Register
          </Typography>

          <form onSubmit={handleSubmit} style={{ fontSize: '1.2rem' }}>
            <TextField
              label="First Name"
              variant="standard"
              fullWidth
              margin="normal"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <TextField
              label="Last Name"
              variant="standard"
              fullWidth
              margin="normal"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <TextField
              label="Date of Birth"
              type="date"
              variant="standard"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={DOB}
              onChange={(e) => setDOB(e.target.value)}
              required
            />
            <TextField
              label="Email"
              type="email"
              variant="standard"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="standard"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="standard"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 2,
                backgroundColor: '#5C5470',
                fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif',
                color: '#fff',

                height: '2.5rem',
                fontSize: '1.2rem',
                '&:hover': { backgroundColor: '#cecece', color: '#000' },
              }}
            >
              Signup
            </Button>
            {error && (
              <Alert severity="error" sx={{ mt: 2, fontSize: '1rem' }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mt: 2, fontSize: '1rem' }}>
                Signup successful! Redirecting...
              </Alert>
            )}
            <Typography sx={{ mt: 2, fontSize: '1.5rem', color:'black', fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif' }}>
              Already a member?{' '}
              <Link to="/login" style={{ color: '#5C5470', fontWeight: 'bold' , fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif'}}>
                Login
              </Link>
            </Typography>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Signup;
