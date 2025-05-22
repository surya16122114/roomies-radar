// import { Button, Link } from '@mui/material';
// import React from 'react';


// const Home: React.FC = () => {
//   return (
//     <>
//       {/* Subscribe Button */}
//       <Button
//             component="a"
//             href="/home"
//             sx={{
//               color: location.pathname === '/' ? '#5C5470' : 'Black',
//               fontSize: '1.2rem',
//               fontWeight: location.pathname === '/' ? 'bold' : '600',
//               textTransform: 'none',
//               borderBottom: location.pathname === '/' ? '2px solid white' : 'none',
//               fontFamily: 'Cambria, Cochin, Georgia, Times, Times New Roman, serif',
//               textDecoration: 'none',
//               '&:hover': { textDecoration: 'underline' , color:'#5C5470'},
//             }}
//           >
//             Home
//         </Button>
//     </>
//   );
// }

// export default Home;

import React from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <Button
      component="a"
      href="/home"
      sx={{
        color: location.pathname === '/' ? '#5C5470' : 'Black',
        fontSize: '1.2rem',
        fontWeight: location.pathname === '/' ? 'bold' : '600',
        textTransform: 'none',
        borderBottom: location.pathname === '/' ? '2px solid white' : 'none',
        fontFamily: 'Cambria, Cochin, Georgia, Times, Times New Roman, serif',
        textDecoration: 'none',
        '&:hover': { textDecoration: 'underline', color: '#5C5470' },
      }}
    >
      {t('home')} {/* Add translation */}
    </Button>
  );
};

export default Home;
