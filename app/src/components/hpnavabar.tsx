import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Select,
  FormControl,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { clearUserDetails } from '../redux/Slice/userslice';
import { logout } from '../redux/Slice/authstate';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/friendship.jpeg';
import SubscribeButton from './subscribebutton';
import { useTranslation } from 'react-i18next';

import Home from './home';
import Post from './post';
import Inbox from './inbox';
import Profile from './profile';
import Logout from './logout';

const HpNavbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const currentUserId = useSelector((state: RootState) => state.user.id);
  const { t, i18n } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogoutSubmit = () => {
    dispatch(clearUserDetails());
    dispatch(logout());
    navigate('/login');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lang: string) => {
   
    if (i18n.changeLanguage) {
      i18n.changeLanguage(lang);
    } else {
      console.error('changeLanguage function is not available');
    }
  };
  

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between', flexWrap: isMobile ? 'wrap' : 'nowrap', margin: '.3rem 3rem' }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: isMobile ? '1 1 100%' : 'none' }}>
          <img src={logo} alt="logo" style={{ width: '5rem', marginRight: '1rem' }} />
          <Typography variant="h5" sx={{ color: '#5C5470', fontWeight: 'bold' }}>
            {t('title')} {/* Use translation for the title */}
          </Typography>
        </Box>

        {/* Desktop Buttons */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Home />
            <SubscribeButton />
            <Post />
            <Inbox />
            <Profile />
            <Logout />
            <FormControl sx={{ minWidth: 100 }}>
              <Select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                displayEmpty
                sx={{
                  color: 'Black',
                  fontSize: '1.2rem',
                  fontWeight:'600',
                  textTransform: 'none',
                  borderBottom: 'none',
                  fontFamily: 'Cambria, Cochin, Georgia, Times, Times New Roman, serif'
                }}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Español</MenuItem>
                <MenuItem value="te">తెలుగు</MenuItem>
                <MenuItem value="ta">தமிழ்</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Mobile Menu */}
        {isMobile && (
          <>
            <IconButton onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{ sx: { width: '250px' } }}
            >
              <MenuItem component={Link} to="/home" onClick={handleMenuClose}>
                {t('home')}
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <SubscribeButton />
              </MenuItem>
              <MenuItem component={Link} to="/create-post" onClick={handleMenuClose}>
                {t('post')}
              </MenuItem>
              <MenuItem component={Link} to="/inbox" onClick={handleMenuClose}>
                {t('inbox')}
              </MenuItem>
              <MenuItem component={Link} to={`/profile/${currentUserId}`} onClick={handleMenuClose}>
                {t('profile')}
              </MenuItem>
              <MenuItem onClick={handleLogoutSubmit}>{t('logout')}</MenuItem>
       
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default HpNavbar;
