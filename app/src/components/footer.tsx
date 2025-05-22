import React from 'react';
import { Box, Typography, Grid, Link } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faLinkedinIn, faTwitter } from '@fortawesome/free-brands-svg-icons';
import friendship from '../assets/friendship.jpeg';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        color: '#5C5470',
        padding: '20px 40px',
        fontFamily: ' Cambria, Cochin, Georgia, Times, "Times New Roman", serif',
        // marginLeft: '10rem',
        // marginRight: '0rem',
      }}
    >
        <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >

        {/* Logo Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: '5rem',
            gap: 2,
          }}
        >
          <div>
          <img
            src={friendship}
            alt="friendship"
            style={{ height: '120px',
                marginRight: '15rem',
                marginBottom: '2rem',
            paddingTop: '3rem',


             }}
          />
          <Typography variant="h6">Roomies Radar</Typography>
          </div>
        </Box>
        
      <Grid container spacing={4}>
        {/* About Section */}
        <Grid item xs={16} sm={4}>
          <Typography variant="h6" gutterBottom>
            About Us
          </Typography>
          <Typography variant="body2">
            We are dedicated to helping people find their perfect roommates and
            places to stay. Connect, explore, and find your ideal living
            situation effortlessly.
          </Typography>
        </Grid>

        {/* Links Section */}
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" gutterBottom>
            Quick Links
          </Typography>
          <Box>
            <Link href="/" color="inherit" underline="hover">
              Home
            </Link>
          </Box>
          <Box>
            <Link href="/about" color="inherit" underline="hover">
              About
            </Link>
          </Box>
          <Box>
            <Link href="/contact" color="inherit" underline="hover">
              Contact
            </Link>
          </Box>
          <Box>
            <Link href="/privacy" color="inherit" underline="hover">
              Privacy Policy
            </Link>
          </Box>
        </Grid>

        {/* Social Media Section */}
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" gutterBottom>
            Follow Us
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link
              href="https://facebook.com"
              color="inherit"
              target="_blank"
              aria-label="Facebook"
              underline="none"
            >
              <FontAwesomeIcon icon={faFacebookF} size="2x" />
            </Link>
            <Link
              href="https://twitter.com"
              color="inherit"
              target="_blank"
              aria-label="Twitter"
              underline="none"
            >
              <FontAwesomeIcon icon={faTwitter} size="2x" />
            </Link>
            <Link
              href="https://instagram.com"
              color="inherit"
              target="_blank"
              aria-label="Instagram"
              underline="none"
            >
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </Link>
            <Link
              href="https://linkedin.com"
              color="inherit"
              target="_blank"
              aria-label="LinkedIn"
              underline="none"
            >
              <FontAwesomeIcon icon={faLinkedinIn} size="2x" />
            </Link>
          </Box>
        </Grid>
      </Grid>
      {/* Footer Image */}

      </Box>
      

      <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} Roomies Radar. All rights reserved.
        </Typography>
      </Box>
      </Box>
  );
};

export default Footer;
