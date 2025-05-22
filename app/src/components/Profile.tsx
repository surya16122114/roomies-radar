import { Button, Link } from '@mui/material';
import React from 'react';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';


const Profile: React.FC = () => {
    const currentUserId = useSelector((state: RootState) => state.user.id);
    const { t } = useTranslation();
  return (
    <>
      {/* Post Button */}
      <Button
            component='a'
            href={`/profile/${currentUserId}`} // Dynamically generate route
            sx={{
              color: location.pathname.startsWith('/profile') ? '#5C5470' : 'Black',
              fontSize: '1.2rem',
              fontWeight: location.pathname.startsWith('/profile') ? 'bold' : '600',
              fontFamily: 'Cambria, Cochin, Georgia, Times, Times New Roman, serif',
              textTransform: 'none',
              borderBottom: location.pathname.startsWith('/profile') ? '2px solid white' : 'none',
            }}
          >
           { t('profile')}
          </Button>
    </>
  );
}

export default Profile;
