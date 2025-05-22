


import { Button, Link } from '@mui/material';
import React from 'react';
import { RootState } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { clearUserDetails } from '../redux/Slice/userslice';
import { logout } from '../redux/Slice/authstate';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const Logout: React.FC = () => {
    const navigate = useNavigate();
    const currentUserId = useSelector((state: RootState) => state.user.id);
    const dispatch = useDispatch();
    const handleLogoutSubmit = () => {
        dispatch(clearUserDetails());
        dispatch(logout());
        navigate('/login');
      };
      const { t } = useTranslation();

  return (
    <>
      {/* Logout Button */}
      <Button
            component={Link}
            // href={`/profile/${currentUserId}`} // Dynamically generate route
            sx={{
              color: 'Black',
              fontSize: '1.2rem',
              fontWeight:'600',
              textTransform: 'none',
              borderBottom: 'none',
              fontFamily: 'Cambria, Cochin, Georgia, Times, Times New Roman, serif'
            }}onClick={handleLogoutSubmit}>
            {t('logout')}
        </Button>
    </>
  );
}

export default Logout;
