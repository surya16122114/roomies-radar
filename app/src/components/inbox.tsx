

import { Button, Link } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';


const Inbox: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* Post Button */}
      <Button
            component='a'
            href="/inbox"
            sx={{
              color: location.pathname === '/inbox' ? '#5C5470' : 'Black',
              fontSize: '1.2rem',
              fontWeight: location.pathname === '/inbox' ? 'bold' : '600',
              textTransform: 'none',
              borderBottom: location.pathname === '/inbox' ? '2px solid white' : 'none',
              fontFamily: 'Cambria, Cochin, Georgia, Times, Times New Roman, serif',
            }}
          >
          {t('inbox')}
          </Button>
    </>
  );
}

export default Inbox;
