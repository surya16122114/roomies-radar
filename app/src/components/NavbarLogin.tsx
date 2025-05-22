


import { Button, Link } from '@mui/material';
import React from 'react';
import { RootState } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { clearUserDetails } from '../redux/Slice/userslice';
import { logout } from '../redux/Slice/authstate';
import { useNavigate } from 'react-router-dom';


const NavbarLogin: React.FC = () => {
    const navigate = useNavigate();
    const currentUserId = useSelector((state: RootState) => state.user.id);
    const dispatch = useDispatch();
    const handleLogoutSubmit = () => {
        dispatch(clearUserDetails());
        dispatch(logout());
        navigate('/login');
      };

  return (
    <>
      {/* Logout Button */}
      <Button
            component={Link}
            href={'/login'}
            sx={{
              color: 'Black',
              fontSize: '1.2rem',
              fontWeight:'600',
              textTransform: 'none',
              borderBottom: 'none',
              fontFamily: 'Cambria, Cochin, Georgia, Times, Times New Roman, serif'
            }}onClick={handleLogoutSubmit}>
                Login / Signup
        </Button>
    </>
  );
}

export default NavbarLogin;
