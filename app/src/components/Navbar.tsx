import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { clearUserDetails } from '../redux/Slice/userslice';
import { logout } from '../redux/Slice/authstate';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import logo from '../assets/friendship.jpeg';
import SubscribeButton from './subscribebutton';
import NavbarHome from './navbarhome';
import NavbarHowitworks from './navabarhowitworks'; 
import Inbox from './inbox';
import Profile from './profile';
import NavbarLogin from './navbarlogin';

const HpNavbar: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Adjust for screens smaller than 'md'
  const currentUserId = useSelector((state: RootState) => state.user.id);


  return (
    <Toolbar sx={{ justifyContent: 'space-between', flexWrap: isMobile ? 'wrap' : 'nowrap' , margin: '.3rem 3rem'}}>
   {/* Logo */}
   <Box sx={{ display: 'flex', alignItems: 'center', flex: isMobile ? '1 1 100%' : 'none' }}>
      <img src={logo} alt="logo" style={{ width: '5rem', marginRight: '1rem' }} />
      <Typography variant="h5" sx={{ color: '#5C5470', fontWeight: 'bold' }}>Roomies Radar</Typography>
   </Box>

   {/* Desktop Buttons */}
   {!isMobile && (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
         <NavbarHome/>
         <NavbarHowitworks/>
         {/* <Inbox/>
         <Profile/> */}
         <NavbarLogin/>
      </Box>
   )}

   {/* Mobile Menu */}
   {isMobile && (
      <>
         <IconButton>
            <MenuIcon />
         </IconButton>
         <Menu
            // anchorEl={anchorEl}
            // open={Boolean(anchorEl)}
            // onClose={handleMenuClose}
            PaperProps={{ sx: { width: '250px' } }} open={false}         >
            <MenuItem component={Link} to="/">Home</MenuItem>
            <MenuItem component={Link} to='#howitworks'>How it Works</MenuItem>
         </Menu>
      </>
   )}
</Toolbar>

  );
};

export default HpNavbar;
