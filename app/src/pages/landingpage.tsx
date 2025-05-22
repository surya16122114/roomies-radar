import React from 'react';
import { Box, Typography, List, ListItem } from '@mui/material';
import House from '../assets/moveout.jpg';
import Navbar from '../components/Navbar';
import Howitworks from '../components/howitworks';
import Footer from '../components/footer';

export default function LandingPage() {
  const features = [
    "Find the perfect roommate match",
    "Browse available listings",
    "Create and manage your profile",
    "Chat with potential roommates",
  ];

  return (
    <>
    <div style={{ overflowX: 'hidden',  }}> {/* Prevent horizontal scrolling */}
      <Navbar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '90vh',
          width: '100%', // Ensure the container width is restricted
          px: { xs: 2, md: 4 },
          py: { xs: 4, md: 6 },
        }}
      >
        {/* Image Section */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: { xs: 4, md: 0 },
          }}
        >
          <img
            src={House}
            alt="House"
            style={{
              width: '100%',
              maxWidth: '600px',
              height: 'auto',
              objectFit: 'contain',
              marginLeft: 0, // Adjust marginLeft for proper alignment
            }}
          />
        </Box>

        {/* Content Section */}
        <Box
          sx={{
            width: { xs: '100%', md: '45%' },
            textAlign: { xs: 'center', md: 'left' },
            padding: { xs: 2, md: '4rem' },
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif',
              fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
              fontWeight: 700,
              color: '#000',
              mb: 2,
            }}
          >
            Roomies Radar 🕊️
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif',
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              fontWeight: 500,
              color: 'black',
              mb: 2,
            }}
          >
            Where finding the right roommate becomes easy and fun!
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif',
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              fontWeight: 'bold',
              color: '#AB4459',
              textDecoration: 'underline',
              mb: 1,
            }}
          >
            Features:
          </Typography>

          <List>
            {features.map((feature, index) => (
              <ListItem
                key={index}
                sx={{
                  fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif',
                  fontSize: { xs: '1rem', md: '1.4rem' },
                  color: '#9E7777',
                  fontWeight: 800,
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                {feature}
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      <Howitworks />
      
    </div>
    <Footer/>
    </>
  );
}
