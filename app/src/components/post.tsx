import { Button, Link } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';


const Post: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* Post Button */}
      <Button
            component='a'
            href="/create-post"
            sx={{
              color: location.pathname === '/create-post' ? '#5C5470' : 'Black',
              fontSize: '1.2rem',
              fontWeight: location.pathname === '/create-post' ? 'bold' : '600',
              textTransform: 'none',
              borderBottom: location.pathname === '/create-post' ? '2px solid white' : 'none',
              fontFamily: 'Cambria, Cochin, Georgia, Times, Times New Roman, serif',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' , color:'#5C5470'},
            }}
          >
         {t('post')}
          </Button>
    </>
  );
}

export default Post;
